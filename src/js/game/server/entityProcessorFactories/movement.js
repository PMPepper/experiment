export default function movementFactory(gameTime) {

  return function(entity, entities) {
    if(!entity.movement) {//ignore entities that do not have movement definition
      return entity;
    }

    switch(entity.movement.type) {
      case 'orbit':
        orbitPositionAtTime(gameTime, entity, entities);
        break;
    }

    return entity;
  }
}



const ORIGIN = {x: 0, y: 0};

//Orbit stuff

/*
{
  movement: {
    type: 'orbit',
    data: {
      "type": "regular",
      "radius": 57909050000,
      "offset": 0.15
    }
  },
  orbitingId: 1?
}
*/


function orbitPositionAtTime(time, entity, entities) {
  if(!entity.movement || entity.movement.type !== 'orbit') {
    return;
  }

  switch(entity.movement.data.type) {
    case 'regular':
      return regularOrbitPositionAtTime(time, entity, entities)
  }

  throw new Error(`Unknown orbit type: '${entity.movement.data.type}'`);
}


function regularOrbitPositionAtTime(time, entity, entities) {
  const parent = entity.orbitingId ? entities[entity.orbitingId] : null;
  const orbit = entity.movement.data;

  if(!parent || !orbit) {
    return
  }

  const orbitRadius = orbit.radius;
  const orbitAngle = regularOrbitAngleAtTime(orbit, time);

  const rx = orbitRadius * Math.cos(orbitAngle);
  const ry = orbitRadius * Math.sin(orbitAngle);

  if(parent) {
    orbitPositionAtTime(parent, time, entities);

    entity.position.x = parent.position.x + rx;
    entity.position.y = parent.position.y + ry;
  } else {
    entity.position.x = rx;
    entity.position.y = ry;
  }
}


function regularOrbitAngleAtTime(orbit, time) {
  const orbitalPeriod = orbit.period;

  time += orbitalPeriod * orbit.offset;

  const orbitFraction = (time % orbitalPeriod)/orbitalPeriod;

  return orbitFraction * Math.PI * 2;
}
