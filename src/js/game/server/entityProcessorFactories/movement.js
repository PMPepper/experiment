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
      newPositionY += parent.position.y;
    }

    position.x = newPositionX;
    position.y = newPositionY;

    //right now just always assume moving elements need updating - because we
    //call movement on parents, meaning they may not change the second time
    //they are updated..? Also, planets always move!
    return true;
  }

  function movement(entity, entities) {
    if(!entity.movement) {// || updatedEntities[entity.id]//ignore entities that do not have movement definition OR have already been processed
      return;
    }

    //updatedEntities[entity.id] = true;

    switch(entity.movement.type) {
      case 'orbitRegular':
        return regularOrbitPositionAtTime(entity, entities);
    }
  }

  return movement;
}
