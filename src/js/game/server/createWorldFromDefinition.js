import orbitPeriod from '@/helpers/physics/orbit-period';
import map from '@/helpers/object/map';
import find from '@/helpers/object/find';
import roundTo from '@/helpers/math/round-to';
import defaultGameDefinition from '../data/defaultGameDefinition';

export default function createWorldFromDefinition(server, definition) {
  //merge in the default game definition
  definition = {...defaultGameDefinition, ...definition};

  //Basic props
  server.minerals = {...definition.minerals};
  server.structures = JSON.parse(JSON.stringify(definition.structures));
  server.researchAreas = {...definition.researchAreas};
  server.research = JSON.parse(JSON.stringify(definition.research));
  server.technology = JSON.parse(JSON.stringify(definition.technology));
  server.systemBodyTypeMineralAbundance = JSON.parse(JSON.stringify(definition.systemBodyTypeMineralAbundance));

  //internal lookup hashes
  const systemsByDefinitionId = {};//[systemDefinitionId] = system entity
  const speciesByDefinitionId = {};//[systemDefinitionId] = system entity
  const systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName = {};//[systemDefinitionId][systemBodyDefinitionName] = systemBody entity
  const factionsByDefinitionName = {};

  //create the systems
  Object.keys(definition.systems).forEach(systemDefinitionId => {
    const systemDefinition = definition.systems[systemDefinitionId];

    //create system entity
    const system = server._newEntity('system', {});

    //update lookup hashes (used later)
    systemsByDefinitionId[systemDefinitionId] = system;
    systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId] = {};

    const systemBodiesBySystemBodyDefinitionName = systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId];

    let systemBodyPosition = [1];

    //now create the bodies
    const bodies = systemDefinition.bodies.map(bodyDefinition => {
      const bodyMass = bodyDefinition.mass || 1;
      const orbitingId = bodyDefinition.parent && systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent] && systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent].id || null;

      const body = server._newEntity('systemBody', {
        systemId: system.id,
        mass: bodyMass,
        movement: bodyDefinition.orbit ?
          {
            ...bodyDefinition.orbit,
            type: 'orbitRegular',
            orbitingId: orbitingId,
            period: orbitPeriod(bodyDefinition.orbit.radius, bodyMass, orbitingId ? systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent].mass : 0)//orbitRadius, orbitingBodyMass, orbitedBodyMass
          }
          :
          null,
        position: {x: 0, y: 0},
        systemBody: {
          type: bodyDefinition.type,
          radius: bodyDefinition.radius,
          day: bodyDefinition.day,
          axialTilt: bodyDefinition.axialTilt,
          tidalLock: !!bodyDefinition.tidalLock,
          albedo: bodyDefinition.albedo || 0,
          luminosity: bodyDefinition.luminosity || 0,
          children: [],
          position: null,
        },
        availableMinerals: generateAvailableMinerals(bodyDefinition, definition)
      });

      if(orbitingId) {
        const orbitingEntity = server.entities[orbitingId];

        orbitingEntity.systemBody.children.push(body.id);

        body.systemBody.position = [...orbitingEntity.systemBody.position, orbitingEntity.systemBody.children.length];
      } else {
        body.systemBody.position = [];
      }

      //record in lookup hash (used later for factions)
      systemBodiesBySystemBodyDefinitionName[bodyDefinition.name] = body;

      return body;
    });

    //update system with body ids
    system.systemBodyIds = bodies.map(body => body.id);
  });

  //Create the species
  Object.keys(definition.species).forEach(id => {
    const speciesDefinition = definition.species[id];

    const entity = server._newEntity('species', {species: {...definition.baseSpecies, ...speciesDefinition}});

    speciesByDefinitionId[id] = entity;
  })

  //create the factions
  definition.factions.forEach(factionDefinition => {
    const faction = server._newEntity('faction', {faction: {
      name: factionDefinition.name,
      colonyIds: [],
      research: {},
      technology: {}
    }});

    factionsByDefinitionName[factionDefinition.name] = faction;

    //record factions separately (in addition to being an entity)
    server.factions[faction.id] = faction;

    //assign initial research and technology
    factionDefinition.startingResearch.forEach(researchId => {
      const research = definition.research[researchId];

      faction.faction.research[researchId] = true;//mark this technology as unlocked

      //now mark technologies as unlocked
      research.unlockTechnologyIds.forEach(technologyId => {
        if(!definition.technology[technologyId]) {
          throw new Error(`Unknown technology '${technologyId}'`);
        }

        faction.faction.technology[technologyId] = true;
      })
    })

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
                name: factionStartingSystemDefinition.bodyNamesMap && factionStartingSystemDefinition.bodyNamesMap[bodyDefinition.name] || bodyDefinition.name,
                isSurveyed: false,
              }
            });
          })

          //record ID's of factionSystemBodies in factionSystem
          factionSystem.factionSystemBodyIds = factionSystemBodies.map(entity => entity.id);

          break;
      }
    });

    //now add starting colonies
    factionDefinition.startingColonies.forEach(startingColonyDefinition => {
      /*
      system: 'Sol',//ID from systemsSystems object (the key)
      body: 'Mars',//body ID (what if random?)
      populations: [
        {
          species: 'Humans',
          population: 1000000000,
        }
      ],
      structures: {
        "1": 200,
        "2": 100,
        "5": 10
      },
      */

      const systemBody = systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[startingColonyDefinition.system][startingColonyDefinition.body];

      //Create the populations
      const populationIds = startingColonyDefinition.populations.map(populationDefinition => {
        const species = speciesByDefinitionId[populationDefinition.species];

        const entity = server._newEntity('population', {
          factionId: faction.id,
          speciesId: species.id,
          systemId: systemBody.systemId,
          systemBodyId: systemBody.id,
          population: {
            quantity: populationDefinition.population
          }
        })

        return entity.id;
      });

      //now create the colony itself
      const colony = server._newEntity('colony', {
        factionId: faction.id,
        systemId: systemBody.systemId,
        systemBodyId: systemBody.id,
        colony: {
          populationIds: populationIds,
          structures: {...startingColonyDefinition.structures}
        }
      });

      //and record as part of the faction
      faction.faction.colonyIds.push(colony.id);

      //mark system body as surveyed
      if(startingColonyDefinition.isSurveyed) {
        const factionSystemBody = find(server.entities, (entity, id) => {
          return entity.type === 'factionSystemBody' && entity.factionId === faction.id && entity.systemBodyId === systemBody.id;
        });

        if(factionSystemBody) {
          factionSystemBody.factionSystemBody.isSurveyed = true;
        }
      }
    });
  })

  /*
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
  })*/

  //TODO clients
  //const client1 = server._newEntity('client', {playerId: player1.id, factionId: faction1.id});

}

function generateAvailableMinerals(bodyDefinition, definition) {
  if(bodyDefinition.type === 'star') {
    return null;
  }

  const isStartingWorld = false;//TODO detect starting worlds

  if(isStartingWorld) {
    //TODO implement starting world minerals
    return null;
  } else {
    return map(definition.minerals, (value, id) => {
      //TODO do all this better..
      const abundance = definition.systemBodyTypeMineralAbundance[bodyDefinition.type][id];

      const quantity = Math.floor(Math.random() * abundance * Math.pow(bodyDefinition.mass, 1/5));
      const access = Math.ceil(Math.random() * 10) / 10//TODO smaller bodies tend towards higher access

      return quantity === 0 || access === 0 ?
        {quantity: 0, access: 0}
        :
        {quantity, access};
    });
  }
}
