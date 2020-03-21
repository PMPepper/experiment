//Helpers
import find from '@/helpers/object/find';
import forEach from '@/helpers/object/forEach';
import orbitPeriod from '@/helpers/physics/orbit-period';

import getShipyardMass from '@/helpers/app/getShipyardMass';
import getShipyardRadius from '@/helpers/app/getShipyardRadius';
import getFactionSystemBodyFromFactionAndSystemBody from '@/helpers/app/getFactionSystemBodyFromFactionAndSystemBody';

//Other
import calculatePopulationWorkers from '@/game/server/entityProcessorFactories/colony/calculatePopulationWorkers';


//The class
export default class EntityManager {
  gameTime = 0;
  entities = null;
  entityId = 1;//used to keep track of assigned entity IDs - increments after each entity is created
  entityIds = null;
  entitiesLastUpdated = {};
  removedEntities = [];

  entityProcessors = null;

  constructor(gameTime, entityProcessors, nameGenerator) {
    this.entities = {};
    this.entityIds = [];

    this.gameTime = gameTime;
    this.entityProcessors = entityProcessors;
    this.nameGenerator = nameGenerator;
  }


  getEntityById(id, type = null) {
    const entity = this.entities[id] || null;

    if(entity && type && entity.type !== type) {
      return null;
    }

    return entity
  }

  getEntitiesByIds(ids) {
    const entities = this.entities;

    return ids.map(id => (entities[id]));
  }

  getAndClearRemovedEntities() {
    const removedEntities = this.removedEntities;

    this.removedEntities = [];

    return removedEntities;
  }

  ///////////////////////////
  // Create entity methods //
  ///////////////////////////
  createSystem() {
    return this._newEntity('system', {});
  }

  createSystemBody(systemId, mass, movement, position, systemBody, availableMinerals) {
    return this._newEntity('systemBody', {
      systemId, mass, movement, position, systemBody, availableMinerals
    });
  }

  createSpecies(species) {
    return this._newEntity('species', {species});
  }

  createFaction(faction) {
    return this._newEntity('faction', {
      faction: {
        shipDesigns: {},
        ...faction
      }
    });
  }

  createFactionSystem(factionId, systemId, factionSystem) {
    return this._newEntity('factionSystem', {
      factionId, systemId, factionSystem
    });
  }

  createFactionSystemBody(factionId, systemBodyId, factionSystemBody) {
    const systemBody = this.getEntityById(systemBodyId, 'systemBody');
    const system = this.getEntityById(systemBody.systemId, 'system');
    const factionSystemId = system.factionSystemIds.find(factionSystemId => {
      const factionSystem = this.getEntityById(factionSystemId, 'factionSystem');

      return factionSystem.factionId === factionId;
    })

    return this._newEntity('factionSystemBody', {
      render: {type: 'factionSystemBody'},
      factionId,
      systemBodyId,
      systemId: system.id,
      factionSystemId,
      factionSystemBody
    });
  }

  createColony(systemBodyId, factionId, minerals = {}, structures = {}, populationIds = []) {
    const systemBody = this.entities[systemBodyId];
    const faction = this.entities[factionId];

    const colony = this._newEntity('colony', {
      factionId,
      systemId: systemBody.systemId,
      systemBodyId: systemBody.id,
      factionSystemBodyId: getFactionSystemBodyFromFactionAndSystemBody(faction, systemBody, this.entities).id,
      researchQueueIds: [],//groups performing research
      shipyardIds: [],
      populationIds,
      colony: {
        structures,
        minerals,

        //research
        researchInProgress: {},//progress on research projects on this colony
        assignedResearchStructures: {},

        //construction
        buildQueue: [],
        buildInProgress: {},//progress on building: {[constructionProjectId]: PP}

        //capabilities
        capabilityProductionTotals: {},
        structuresWithCapability: {},
        populationCapabilityProductionTotals: {},
        populationStructuresWithCapability: {},
        populationUnitCapabilityProduction: {},
      }
    });

    //update faction
    faction.faction.colonyIds.push(colony.id);
    //this.entitiesLastUpdated[factionId] = this.gameTime + 1;//mark faction as updated
    this.alteredEntity(factionId);

    return colony;
  }

  createResearchQueue(colonyId, structures, researchIds) {
    const colony = this.getEntityById(colonyId, 'colony');

    if(!colony) {
      throw new Error('cannot create research group, invalid colonyId');
    }

    const researchQueue = this._newEntity('researchQueue', {
      factionId: colony.factionId,
      colonyId: colony.id,

      researchQueue: {
        structures,//describes what population/structures this queue would like to use - what they get depends on what is available - groups are assigned structures based on order
        researchIds//array of research projects IDs, to be performed in order
      }
    });

    return researchQueue;
  }

  createPopulation(factionId, colonyId, speciesId, quantity) {
    const colony = this.getEntityById(colonyId, 'colony');


    const entity = this._newEntity('population', {
      factionId,
      speciesId,
      colonyId: colony ? colony.id : null,

      population: {
        quantity,

        supportWorkers: 0,
        effectiveWorkers: 0,
      }
    });

    //Init worker counts
    calculatePopulationWorkers(entity, this.entities);

    // if(colony) {
    //   this.addPopulationToColony(colony.id, entity.id);
    // }

    return entity;
  }

  addPopulationToColony(colonyId, populationId) {
    const colony = this.getEntityById(colonyId, 'colony');
    const population = this.getEntityById(populationId, 'population');

    if(!colony || !population) {
      debugger;//shouldn't happen

      return;
    }

    colony.populationIds.push(population.id);

    population.colonyId = colony.id;

    //mark as updated
    //this.entitiesLastUpdated[colonyId] = this.gameTime + 1;//mark faction as updated
    //this.entitiesLastUpdated[populationId] = this.gameTime + 1;//mark faction as updated

    this.alteredEntity(colonyId);
    this.alteredEntity(populationId);
  }

  addStructuresToColony(colonyId, populationId, structures) {
    const colony = this.getEntityById(colonyId, 'colony');

    if(!colony) {
      return
    }

    populationId = populationId || 0;

    if(!colony.colony.structures[populationId]) {
      colony.colony.structures[populationId] = {}
    }

    const currentStructures = colony.colony.structures[populationId];

    forEach(structures, (quantity, structureId) => {
      if(currentStructures[structureId]) {
        currentStructures[structureId] += quantity;
      } else {
        currentStructures[structureId] = quantity;
      }

      //prevent negative quantities
      currentStructures[structureId] = Math.max(0, currentStructures[structureId]);
    });

    this.alteredEntity(colonyId);
  }

  createShipyard(populationId, isMilitary, capacity, slipways, name = null, orbitOffset = null) {
    const population = this.getEntityById(populationId, 'population');
    const colony = this.getEntityById(population.colonyId, 'colony');
    const faction = this.getEntityById(colony.factionId, 'faction');
    const systemBody = this.getEntityById(colony.systemBodyId, 'systemBody');

    //get initial orbit/position values
    const orbitRadius = systemBody.systemBody.radius * 2;//TODO calculate this based on the systemBody, atmosphere, etc - aim for geostationary?
    orbitOffset = orbitOffset === null ? Math.random() : orbitOffset;
    const mass = getShipyardMass(isMilitary, capacity, slipways, this.gameConfig);//TODO just a temp calculation
    const radius = getShipyardRadius(isMilitary, capacity, slipways, this.gameConfig);//TODO just a temp calculation
    const orbitalPeriod = orbitPeriod(orbitRadius, mass, systemBody.mass);//orbitRadius, orbitingBodyMass, orbitedBodyMass,
    const orbitFraction = ((this.gameTime + (orbitalPeriod * orbitOffset)) % orbitalPeriod)/orbitalPeriod;
    const orbitAngle = orbitFraction * Math.PI * 2;
    const positionX = systemBody.position.x + (orbitRadius * Math.cos(orbitAngle));
    const positionY = systemBody.position.y + (orbitRadius * Math.sin(orbitAngle));

    const shipyard = this._newEntity('shipyard', {
      mass,
      populationId,
      colonyId: colony.id,
      factionId: faction.id,
      systemId: colony.systemId,
      systemBodyId: colony.systemBodyId,
      factionSystemBodyId: getFactionSystemBodyFromFactionAndSystemBody(faction, this.entities[colony.systemBodyId], this.entities).id,

      render: {type: 'shipyard'},

      movement: {
        type: 'orbitRegular',
        orbitingId: systemBody.id,
        radius: orbitRadius,
        period: orbitalPeriod,
        offset: orbitOffset,
      },
      position: {
        x: positionX,
        y: positionY,
      },

      shipyard: {//TODO props for upgrade progress? or is that a construction project? What about ships under construction?
        isMilitary,
        capacity,
        slipways,
        radius,
        name: ''
      }
    });

    shipyard.shipyard.name = this.nameGenerator.getEntityName(shipyard)

    return shipyard;
  }

  //generic entity management methods
  alteredEntity = (entity) => {
    if(typeof(entity) !== 'object') {
      entity = this.entities[entity];
    }

    //record that entity has been updated
    this.entitiesLastUpdated[entity.id] = this.gameTime+1;//The +1 is to ensure that all clients are told about this right away

    //TODO mark entity as dirty and only perform this step at the start of the next tick?

    //Check if this entity needs to be added/removed to/from any processors
    this.entityProcessors.forEach(entityProcessor => entityProcessor.updateEntity(entity));
  }

  alteredEntities(entities) {
    entities.forEach(this.alteredEntity);
  }

  removeEntity(entity) {
    if(typeof(entity) !== 'object') {
      entity = this.entities[entity];
    }

    const entityId = entity.id;

    if(this.entities[entityId]) {
      this.entityIds.splice(this.entityIds.indexOf(entity), 1);

      delete this.entities[entityId];
      delete this.entitiesLastUpdated[entityId];

      const modifiedEntities = new Set();

      //remove any links with other entities
      for(let i = 0; i < linkedEntityIdProps.length; i++) {
        const prop = linkedEntityIdProps[i];

        if(prop in entity) {

          //unlink entity
          const linkedEntity = this.entities[entity[prop]]

          if(linkedEntity) {
            const linkedProp = entity.type + 'Ids';

            if(linkedEntity[linkedProp]) {
              const linkIndex = linkedEntity[linkedProp].indexOf(entityId);

              if(linkIndex !== -1) {
                linkedEntity[linkedProp].splice(linkIndex, 1);
                modifiedEntities.add(linkedEntity);
              }
            }
          }
        }
      }

      //remove from entityProcessors
      this.entityProcessors.forEach(entityProcessor => entityProcessor.removeEntity(entityId));

      //mark as removed
      this.removedEntities.push(entityId);

      //update modified entities
      modifiedEntities.forEach(entity => (this.alteredEntity(entity)))
    }
  }

  nextId() {
    return this.entityId++;
  }

  findEntity(findMethod) {
    return find(this.entities, findMethod);
  }

  //////////////////////
  // Internal methods //
  //////////////////////

  _newEntity(type, props) {
    const newEntity = {
      ...props,
      id: this.nextId(),
      type,
    };

    this.entities[newEntity.id] = newEntity;
    this.entityIds.push(newEntity.id);
    this.entitiesLastUpdated[newEntity.id] = this.gameTime + 1;

    //automatically add ref to this entity in linked entities
    //-props to check for links

    const allModifiedEntities = new Set();

    for(let i = 0; i < linkedEntityIdProps.length; i++) {
      const prop = linkedEntityIdProps[i];

      if(prop in props) {
        const linkedEntityId = props[prop];
        const linkedEntity = this.entities[linkedEntityId];

        if(linkedEntity) {
          const linkedIdsProp = type+'Ids';

          //if cross reference doesn't exist, add it
          if(!linkedEntity[linkedIdsProp]) {
            linkedEntity[linkedIdsProp] = [];
          }

          //record ref to this entity...
          linkedEntity[linkedIdsProp].push(newEntity.id);

          //...and update last updated time
          //this.entitiesLastUpdated[linkedEntity.id] = this.gameTime + 1;//this is done by altered entity method later

          //Record that an entity has been modified
          allModifiedEntities.add(linkedEntity);
        }
      }
    }

    //add new entity to entityProcessors
    this.entityProcessors.forEach(entityProcessor => {
      entityProcessor.addEntity(newEntity);
    });

    //..and mark linked entities as modified
    allModifiedEntities.forEach(modifiedEntity => {
      this.alteredEntity(modifiedEntity);
    });

    return newEntity;
  }
}

const linkedEntityIdProps = ['factionId', 'speciesId', 'systemBodyId', 'systemId', 'speciesId', 'factionSystemId', 'factionSystemBodyId', 'colonyId', 'researchQueueId', 'shipyardId'];
