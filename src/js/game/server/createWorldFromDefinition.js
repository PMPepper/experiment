//Helpers
import orbitPeriod from '@/helpers/physics/orbit-period';
import map from '@/helpers/object/map';

import forEach from '@/helpers/object/forEach';

import roundTo from '@/helpers/math/round-to';
import random from '@/helpers/math/random';
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

  //Parse structures for construction projects
  server.constructionProjects = JSON.parse(JSON.stringify(definition.constructionProjects || {}));
  forEach(definition.structures, (structure, structureId) => {
    if(structure.canBuild) {
      //add construction project
      server.constructionProjects[structureId] = {
        name: structure.name,
        bp: structure.bp,
        minerals: structure.minerals,
        requiredStructures: {},
        producedStructures: {
          [structureId]: 1
        }
      }

      //not actually really a part of a structure definition
      delete structure.canBuild;
    }

  });

  //internal lookup hashes
  const systemsByDefinitionId = {};//[systemDefinitionId] = system entity
  const speciesByDefinitionId = {};//[systemDefinitionId] = system entity
  const systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName = {};//[systemDefinitionId][systemBodyDefinitionName] = systemBody entity
  const factionsByDefinitionName = {};

  function getPopulationIdFromSpeciesNameAndColonyId(speciesName, colonyId) {
    const species = speciesByDefinitionId[speciesName];
    const colony = server.entityManager.getEntityById(colonyId, 'colony');

    return colony.populationIds.find(populationId => {
      const population = server.entityManager.getEntityById(populationId, 'population');

      return population.speciesId === species.id;
    })
  }

  //create the systems
  Object.keys(definition.systems).forEach(systemDefinitionId => {
    const systemDefinition = definition.systems[systemDefinitionId];

    //create system entity
    const system = server.entityManager.createSystem('system', {});

    //update lookup hashes (used later)
    systemsByDefinitionId[systemDefinitionId] = system;
    systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId] = {};

    const systemBodiesBySystemBodyDefinitionName = systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[systemDefinitionId];

    let systemBodyPosition = [1];

    //now create the bodies
    const bodies = systemDefinition.bodies.map(bodyDefinition => {
      const bodyMass = bodyDefinition.mass || 1;
      const orbitingId = bodyDefinition.parent && systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent] && systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent].id || null;

      const body = server.entityManager.createSystemBody(
        system.id,
        bodyMass,
        bodyDefinition.orbit ?
          {
            ...bodyDefinition.orbit,
            type: 'orbitRegular',
            orbitingId: orbitingId,
            period: orbitPeriod(bodyDefinition.orbit.radius, bodyMass, orbitingId ? systemBodiesBySystemBodyDefinitionName[bodyDefinition.parent].mass : 0)//orbitRadius, orbitingBodyMass, orbitedBodyMass
          }
          :
          null,
        {x: 0, y: 0},
        {
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
        generateAvailableMinerals(bodyDefinition, definition)
      );

      if(orbitingId) {
        const orbitingEntity = server.entityManager.getEntityById(orbitingId, 'systemBody');

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

    const entity = server.entityManager.createSpecies({...definition.baseSpecies, ...speciesDefinition});

    speciesByDefinitionId[id] = entity;
  })

  //create the factions
  definition.factions.forEach(factionDefinition => {
    const faction = server.entityManager.createFaction({
      name: factionDefinition.name,
      colonyIds: [],
      research: {},
      technology: {}
    });

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

    const factionSystemBodyBySystemBodyId = {};

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
          const factionSystem = server.entityManager.createFactionSystem(
            faction.id,
            system.id,
            {
              name: factionStartingSystemDefinition.name || systemDefinitionId//if faction has defined it's own name, use that
            }
          );

          //Now repeat for the system bodies
          const factionSystemBodies = systemDefinition.bodies.map(bodyDefinition => {
            const factionSystemBody = server.entityManager.createFactionSystemBody(
              faction.id,
              systemBodiesBySystemBodyDefinitionName[bodyDefinition.name].id,
              {
                name: factionStartingSystemDefinition.bodyNamesMap && factionStartingSystemDefinition.bodyNamesMap[bodyDefinition.name] || bodyDefinition.name,
                isSurveyed: false,
              }
            );

            factionSystemBodyBySystemBodyId[factionSystemBody.systemBodyId] = factionSystemBody;

            return factionSystemBody;
          })

          //record ID's of factionSystemBodies in factionSystem
          factionSystem.factionSystemBodyIds = factionSystemBodies.map(entity => entity.id);

          break;
      }
    });

    //now add starting colonies
    //-keep track of system bodies that have starting colonies
    const systemBodiesWithStartingColonies = new Set();

    factionDefinition.startingColonies.forEach(startingColonyDefinition => {
      const systemBody = systemBodiesBySystemDefinitionIdBySystemBodyDefinitionName[startingColonyDefinition.system][startingColonyDefinition.body];
      systemBodiesWithStartingColonies.add(systemBody);

      //Create the colony
      const colony = server.entityManager.createColony(systemBody.id, faction.id, map(definition.minerals, () => (0)));//, structures, populationIds.filter(id => (id !== null))

      const structures = {};

      //Create the populations
      startingColonyDefinition.populations.forEach(populationDefinition => {
        let populationId = 0;

        if(populationDefinition.species) {
          const species = speciesByDefinitionId[populationDefinition.species];

          const entity = server.entityManager.createPopulation(faction.id, colony.id, species.id, populationDefinition.population);

          populationId = entity.id;
        }

        if(populationDefinition.structures) {//assign structures to colony
          server.entityManager.addStructuresToColony(colony.id, populationId, {...populationDefinition.structures});
        }
      });


      //mark system body as surveyed
      if(startingColonyDefinition.isSurveyed) {
        const factionSystemBody = server.entityManager.findEntity((entity, id) => {
          return entity.type === 'factionSystemBody' && entity.factionId === faction.id && entity.systemBodyId === systemBody.id;
        });

        if(factionSystemBody) {
          factionSystemBody.factionSystemBody.isSurveyed = true;
        }
      }

      //now add shipyards
      if(startingColonyDefinition.shipyards) {
        startingColonyDefinition.shipyards.forEach(shipyardDefinition => {
          server.entityManager.createShipyard(
            getPopulationIdFromSpeciesNameAndColonyId(shipyardDefinition.species, colony.id),
            !!shipyardDefinition.military,
            shipyardDefinition.capacity,
            shipyardDefinition.slipways,
            shipyardDefinition.orbitOffset || null
          );
        })
      }
    });

    //upgrade minerals of system bodies with starting colonies to startingWorldMinerals levels
    systemBodiesWithStartingColonies.forEach(systemBody => {
      systemBody.availableMinerals = generateStartingWorldMinerals(definition.startingWorldMinerals);
    })
  })
}

function generateStartingWorldMinerals(startingWorldMineralsDefinition) {
  return map(startingWorldMineralsDefinition, ({quantity, access}) => {
    return {
      quantity: random(quantity[0], quantity[1], 0),
      access: random(access[0], access[1], 1)
    }
  });
}

function generateAvailableMinerals(bodyDefinition, definition) {
  if(bodyDefinition.type === 'star') {
    return null;
  }

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
