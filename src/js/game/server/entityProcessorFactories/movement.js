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

    const rx = orbitRadius * Math.cos(orbitAngle);
    const ry = orbitRadius * Math.sin(orbitAngle);

    if(parent) {
      if(parent.movement) {
        movement(parent, entities);
      }

      entity.position.x = parent.position.x + rx;
      entity.position.y = parent.position.y + ry;
    } else {
      entity.position.x = rx;
      entity.position.y = ry;
    }
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
