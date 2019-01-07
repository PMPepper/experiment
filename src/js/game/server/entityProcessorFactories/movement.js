export default function movementFactory(time, entity, entities) {
  //const updatedEntities = {};

  function regularOrbitPositionAtTime(entity, entities) {
    if(!entity.movement || !entity.movement.orbitingId) {
      return;
    }

    const parent = entities[entity.movement.orbitingId];
    const orbit = entity.movement;


    const orbitRadius = orbit.radius;
    const orbitalPeriod = orbit.period;
    const orbitFraction = ((time + (orbitalPeriod * orbit.offset)) % orbitalPeriod)/orbitalPeriod;
    const orbitAngle = orbitFraction * Math.PI * 2;
    const position = entity.position;

    let newPositionX = orbitRadius * Math.cos(orbitAngle);
    let newPositionY = orbitRadius * Math.sin(orbitAngle);

    if(parent) {
      if(parent.movement) {
        movement(parent, entities);
      }

      newPositionX += parent.position.x;
      newPositionX += parent.position.y;
    }

    //this entity has moved, update it's position and return true
    if(newPositionX !== position.x || newPositionY !== position.y) {
      position.x = newPositionX;
      position.y = newPositionY;

      return true;
    }

    return false;
  }

  function movement(entity, entities) {
    if(!entity.movement) {// || updatedEntities[entity.id]//ignore entities that do not have movement definition OR have already been processed
      return;
    }

    //updatedEntities[entity.id] = true;

    switch(entity.movement.type) {
      case 'orbitRegular':
        regularOrbitPositionAtTime(entity, entities);
        break;
    }
  }

  return movement;
}
