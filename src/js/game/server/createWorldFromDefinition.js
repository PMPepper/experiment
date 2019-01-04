

export default function createWorldFromDefinition(server, definition) {
  //internal lookup hashes
  const systemsByDefinitionId = {};//[systemDefinitionId] = system entity
  const systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName = {};//[systemDefinitionId][systemBodyDefinitionName] = systemBody entity
  const factionsByDefinitionName = {};

  //create the system bodies
  Object.keys(definition.systems).forEach(systemDefinitionId => {
    const systemDefinition = definition.systems[systemDefinitionId];

    //create system entity
    const system = server._newEntity('system', {});

    //update lookup hashes (used later)
    systemsByDefinitionId[systemDefinitionId] = system;
    systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId] = {};

    const systemBodiesBySystemBodyDefinitionName = systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId];

    //now create the bodies
    const bodies = systemDefinition.bodies.map(bodyDefinition => {
      const body = server._newEntity('systemBody', {
        systemId: system.id,
        orbitingId: bodyDefinition.parent && systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent] && systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent].id || null,
        mass: bodyDefinition.mass,
        movement: bodyDefinition.orbit ? {type: 'orbit', data: {...bodyDefinition.orbit}} : null,
        systemBody: {
          type: bodyDefinition.type,
          radius: bodyDefinition.radius,
          day: bodyDefinition.day,
          axialTilt: bodyDefinition.axialTilt,
          tidalLock: !!bodyDefinition.tidalLock,
          albedo: bodyDefinition.albedo || 0,
          luminosity: bodyDefinition.luminosity || 0
        }
      });

      //record in lookup hash (used later for factions)
      systemBodiesBySystemBodyDefinitionName[bodyDefinition.name] = body;

      return body;
    });

    //update system with body ids
    system.systemBodyIds = bodies.map(body => body.id);
  });

  //create the factions
  definition.factions.forEach(factionDefinition => {
    const faction = server._newEntity('faction', {faction: {name: factionDefinition.name}});

    factionsByDefinitionName[factionDefinition.name] = faction;

    //record factions separately (in addition to being an entity)
    server.factions[faction.id] = faction;

    //Now link factions to systems
    Object.keys(factionDefinition.startingSystems).forEach(systemDefinitionId => {
      const systemDefinition = definition.systems[systemDefinitionId];
      const factionStartingSystemDefinition = factionDefinition.startingSystems[systemDefinitionId];
      const system = systemsByDefinitionId[systemDefinitionId];
      const systemBodiesBySystemBodyDefinitionName = systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId];

      if(!system) {
        throw new Error(`Unknown system '${systemDefinitionId}' in startingSystems for faction '${factionDefinition.name}'`);
      }

      switch(factionStartingSystemDefinition.type) {
        case 'known':
          //create faction system entity, and apply name
          const factionSystem = server._newEntity('factionSystem', {
            systemId: system.id,
            factionId: faction.id,
            factionSystem: {
              name: factionStartingSystemDefinition.name || systemDefinitionId//if faction has defined it's own name, use that
            },

          });

          //Now repeat for the system bodies
          const factionSystemBodies = systemDefinition.bodies.map(bodyDefinition => {
            return server._newEntity('factionSystemBody', {
              render: {type: 'factionSystemBody'},
              systemId: system.id,
              factionId: faction.id,
              systemBodyId: systemBodiesBySystemBodyDefinitionName[bodyDefinition.name].id,
              factionSystemId: factionSystem.id,
              factionSystemBody: {
                name: factionStartingSystemDefinition.bodyNamesMap && factionStartingSystemDefinition.bodyNamesMap[bodyDefinition.name] || bodyDefinition.name
              }
            });
          })

          //record ID's of factionSystemBodies in factionSystem
          factionSystem.factionSystemBodyIds = factionSystemBodies.map(entity => entity.id);

          break;
      }
    })
  })

  definition.players.forEach(playerDefinition => {
    const player = server._newEntity('player', {player: {name: playerDefinition.name}, factionIds: []});

    //record player
    server.players[player.id] = player;

    playerDefinition.factions.forEach(playerFactionDefinition => {
      const faction = factionsByDefinitionName[playerFactionDefinition.name];

      if(!faction) {
        throw new Error(`Unknown faction '${playerFactionDefinition.name}' in player definition '${playerDefinition.name}'`);
      }

      const factionPlayer = server._newEntity('factionPlayer', {factionId: faction.id, playerId: player.id, factionPlayer: {role: playerFactionDefinition.role}});

      //record factionPlayer
      server.factionPlayers[factionPlayer.id] = factionPlayer;
    });
  })

  //TODO clients
  //const client1 = server._newEntity('client', {playerId: player1.id, factionId: faction1.id});

}