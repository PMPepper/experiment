//TODO only calculate body positions if necessary

import EntityProcessor from '@/game/server/EntityProcessor';

function orbitTest(entity) {
  return entity.movement && entity.movement.orbitingId
}

function orbitFactory(lastTime, time, init, full) {
  const updatedEntities = {};



  function orbitProcessor(entity, entities) {
    if(!init && !full) {
      return null;//TODO check if body needs to update (e.g. is system empty? then don't need to update)
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

    if(position.x !== newPositionX || position.y !== newPositionY) {
      position.x = newPositionX;
      position.y = newPositionY;

      return true;
    }

    return false;
  }

  function movement(entity, entities) {
    if(!entity.movement) {//ignore entities that do not have movement definitio
      return;
    }

    const id = entity.id;

    //If this entity has already been processed, return the result of that
    if(id in updatedEntities) {
      return updatedEntities[id];
    }

    let result = false;

    switch(entity.movement.type) {
      case 'orbitRegular':
        result = orbitProcessor(entity, entities);
    }

    //record the result to prevent repeat processing
    return updatedEntities[id] = result;
  }

  return movement;
}

export default () => (new EntityProcessor(orbitTest, orbitFactory));
