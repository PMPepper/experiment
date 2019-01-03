import * as Server from './Server';

import systems from './data/systems';

export function startGame() {
  //Initialise server state
  const faction1 = Server.newEntity('faction', {faction: {name: 'Humans'}});
  //const faction2 = Server.newEntity('faction', {faction: {name: 'Martians'}});

  const factions = [faction1];//, faction2

  const player1 = Server.newEntity('player', {player: {name: 'Paul'}, factionIds: [faction1.id]});
  //const player2 = Server.newEntity('player', {player: {name: 'John'}, factionIds: [faction2.id]});

  const client1 = Server.newEntity('client', {playerId: player1.id, factionId: faction1.id});
  //const client2 = Server.newEntity('client', {playerId: player2.id, factionId: faction2.id});

  Object.values(systems).forEach(systemData => {
    const bodies = [];
    const bodiesByName = {};//used for parsing only

    const system = Server.newEntity('system', {bodyIds: null})

    systemData.bodies.forEach(bodyData => {
      const body = Server.newEntity('systemBody', {
        systemId: system.id,
        orbitingId: bodyData.parent && bodiesByName[bodyData.parent] && bodiesByName[bodyData.parent].id || null,
        mass: bodyData.mass,
        movement: bodyData.orbit ? {type: 'orbit', data: {...bodyData.orbit}} : null,
        systemBody: {
          type: bodyData.type,
          radius: bodyData.radius,
          day: bodyData.day,
          axialTilt: bodyData.axialTilt,
          tidalLock: !!bodyData.tidalLock,
          albedo: bodyData.albedo || 0,
          luminosity: bodyData.luminosity || 0
        }
      });

      bodiesByName[bodyData.name] = body;
      bodies.push(body);
    });

    //update system with body ids
    system.systemBodyIds = bodies.map(body => body.id);

    //create faction system/body objects
    factions.forEach(faction => {
      const factionSystem = Server.newEntity('factionSystem', {
        systemId: system.id,
        factionId: faction.id,
        factionSystem: {
          name: systemData.name
        }
      });

      systemData.bodies.forEach(bodyData => {
        Server.newEntity('factionSystemBody', {
          render: {type: 'factionSystemBody'},
          systemId: system.id,
          factionId: faction.id,
          systemBodyId: bodiesByName[bodyData.name].id,
          factionSystemId: factionSystem.id,
          factionSystemBody: {
            name: bodyData.name
          }
        });
      });
    })
  })

  return Server;
}


//Server.debug();

//console.log(Server.getCachedEntities('factionSystems', faction1.id))
//console.log(Server.getCachedEntities('factionSystemBodies', faction1.id))
//console.log(Server.getCachedEntities('factionSystemBodiesGrouped', faction1.id))
