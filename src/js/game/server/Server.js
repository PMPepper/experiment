import resolvePath from '@/helpers/object/resolve-path';
import map from '@/helpers/object/map';
import forEach from '@/helpers/object/forEach';
import isEmpty from '@/helpers/object/isEmpty';
import getFactionSystemBodyFromFactionAndSystemBody from '@/helpers/app/getFactionSystemBodyFromFactionAndSystemBody';

import createWorldFromDefinition from './createWorldFromDefinition';
//import * as entityCacheTypes from './entityCacheTypes';
import * as FactionClientTypes from '../FactionClientTypes';

import movementFactory from './entityProcessorFactories/movement';
//import populationFactory from './entityProcessorFactories/population';
import colonyFactory from './entityProcessorFactories/colony';


import calculatePopulationWorkers from '@/game/server/entityProcessorFactories/colony/calculatePopulationWorkers';


//Server phases
const INITIALISING = 'initialising';
const CONNECTING = 'connecting';
const RUNNING = 'running';

const global = typeof(window) === 'object' ? window : {};


export default class Server {
  connector = null;

  phase = INITIALISING;

  gameTime = null;
  totalElapsedTime = null;
  timeMultiplier = 60;//3 * 24 * 3600;//time multiplyer
  gameSecondsPerStep = 1;//60;//game seconds to process per step - higher = less processing, but risks resolution based issues
  isPaused = false;

  factions;//e.g. The in-game factions Humans, martians (factions are also entities)
  clients;//a client is a player connected to a faction by a connector method with a permissions e.g. Bob spectating Martians on clientId 1
  minerals;
  structures;
  research;
  researchAreas;
  technology;
  systemBodyTypeMineralAbundance;

  gameConfig;

  entities = null;
  entityId = null;//used to keep track of assigned entity IDs - increments after each entity is created
  entityIds = null;
  entitiesLastUpdated = null;

  entityProcessorFactories = [movementFactory, colonyFactory];

  clientLastUpdatedTime = null

  constructor(connector) {
    this.connector = connector;
  }

  //////////////////////
  // message handlers //
  //////////////////////

  //-initialising server
  message_createWorld(definition, clientId) {
    if(this.phase !== INITIALISING) {
      throw new Error('Can only create world while Server is in "initialising" phase');
    }

    //c/onsole.log('[Server] createWorld: ', definition, clientId);
    this.totalElapsedTime = this.gameTime = Math.floor(new Date(definition.startDate).valueOf() / 1000);

    //initialise the world based on supplied definition
    this.factions = {};
    this.clients = {};
    this.entityId = 1;
    this.entities = {};
    this.entityIds = [];
    this.clientLastUpdatedTime = {};
    this.entitiesLastUpdated = {};
    createWorldFromDefinition(this, definition);

    this.gameConfig = {
      minerals: this.minerals,
      structures: this.structures,
      researchAreas: this.researchAreas,
      research: this.research,
      technology: this.technology,
    };

    //c/onsole.log('[Server] created world: ', this.entities);

    this._advanceTime(null);

    //Now waiting for players to connect
    this.phase = CONNECTING;

    //broadcast to players that state has updated
    this.connector.broadcastToClients('phaseChanged', this.phase);

    //Report back to clients that game is ready
    return Promise.resolve();
  }

  message_connectClient({name}, clientId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only connect player while Server is in "connecting" phase');
    }

    if(this.clients[clientId]) {
      throw new Error('Each client can only connect once');
    }

    //check client name is valid
    this._checkValidClientName(name, clientId);

    //c/onsole.log('[Server] connectClient: ', name, clientId);

    //create a client
    //factions are the available factions (id: role hash), factionId is the actual faction they are connected as right now
    this.clients[clientId] = {name, id: clientId, type: 'human', ready: false, factions: {}, factionId: null, gameTime: this.gameTime, gameSpeed: 1, isPaused: true};

    //Broadcast updated clients info
    this.connector.broadcastToClients('clientConnected', this.clients);

    //return game details to newly connected client
    return Promise.resolve({
      //entities: this.entities,
      factions: this.factions,
      clients: this.clients,
      minerals: this.minerals,
      structures: this.structures,
      research: this.research,
      researchAreas: this.researchAreas,
      technology: this.technology,
    })
  }

  message_setClientSettings({name, factions, factionId, ready}, clientId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only set connected player settings while Server is in "connecting" phase');
    }

    this._checkValidClient(clientId);
    this._checkValidClientName(name, clientId);

    //TODO check that name is unique

    const client = this.clients[clientId];


    //TODO check that client settings are valid e.g. is connecting to valid faction(s) not already controlled by someone else
    if(factions === null || isEmpty(factions)) {
      //joining as spectator
      factions = map(this.factions, (faction) => (FactionClientTypes.SPECTATOR));
    } else {
      if(Object.keys(factions).some(factionId => {
        return this._getClientsForFaction(factionId, [FactionClientTypes.OWNER]).some(thisClientId => (thisClientId !== clientId));
      })) {
        throw new Error(`Invalid client settings, faction(s) already owned by '${factionId}'`);
      }

      if(!this.factions[factionId]) {
        throw new Error(`Invalid client settings, unknown factionId '${factionId}'`);
      }

      if(!factions[factionId]) {
        throw new Error(`Invalid client settings, invalid factionId '${factionId}' (must be a faction you have permission for)`);
      }
    }

    //c/onsole.log('[Server] setClientSettings: ', name, factions, factionId, ready, clientId);

    ready = !!ready;

    //update state
    this.clients[clientId] = {...client, name, factions, factionId, ready};

    //broadcast updated state to all players
    this.connector.broadcastToClients('clientUpdated', this.clients);

    //new settings applied successfully
    return Promise.resolve(true);
  }

  message_startGame(data, clientId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only start game while Server is in "connecting" phase');
    }

    this._checkValidClient(clientId);

    const client = this.clients[clientId];


    //c/onsole.log('[Server] startGame');
    this.phase = RUNNING;

    //Only only start game if all players are ready
    if(Object.values(this.clients).every(client => (client.ready))) {
      //For each client, tell them the game is starting and send them their client state
      Object.values(this.clients).forEach(client => {
        this.connector.sendMessageToClient(client.id, 'startingGame', this._getClientState(client.id, true));
      });

      this._lastTime = Date.now();

      if(global && global.requestAnimationFrame) {
        const play = () => {
          //stop if no longer in running phase
          if(this.phase !== RUNNING) {
            return;
          }

          const now = Date.now();
          const elapsedTime = Math.min(0.5, (now - this._lastTime)/1000);//limit max elapsed time to prevent issues with the game when it does not have focus

          this._onTick(elapsedTime);

          this._lastTime = now;

          //keep running
          global.requestAnimationFrame(play);
        }

        global.requestAnimationFrame(play);
      } else {
        this._tickIId = setInterval(() => {
          //stop if no longer in running phase
          if(this.phase !== RUNNING) {
            if(this._tickIId) {
              clearInterval(this._tickIId);
              this._tickIId = null;
            } else {
              debugger;//This should never happen!
            }

            return;//stop if no longer in running phase
          }

          const now = Date.now();
          const elapsedTime = (now - this._lastTime) / 1000;

          this._onTick(elapsedTime);

          this._lastTime = now;
        }, 1000 / 60);
      }


      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  //-in game
  message_getClientState(lastUpdateTime, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only get client state while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    return Promise.resolve(this._getClientState(clientId, true))
  }

  message_setDesiredSpeed(newDesiredSpeed, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only set desired speed while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    this.clients[clientId].gameSpeed = Math.max(1, Math.min(5, newDesiredSpeed|0))
  }

  message_setIsPaused(newIsPaused, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only set is paused while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    this.clients[clientId].isPaused = !!newIsPaused;
  }

  message_createColony(systemBodyId, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only create colony while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    const colony = this.createColony(systemBodyId, this.clients[clientId].factionId);

    return Promise.resolve(colony.id);
  }

  message_createResearchGroup(colonyId, structures, projects, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only add research group while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    const factionId = this.clients[clientId].factionId;
    const colony = this.getEntityById(colonyId);

    if(!colony || colony.factionId !== factionId) {
      throw new Error('Cannot add researchGroup, invalid colony');
    }

    const researchGroup = this.createResearchGroup(colonyId, structures || {}, projects || []);

    return Promise.resolve(researchGroup.id);
  }

  message_removeResearchGroup(researchGroupId, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only remove research group while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    this.clients[clientId].factionId;

    //TODO
  }

  message_updateResearchGroup(researchGroupId, structures, projects, clientId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only remove research group while server is in "running" phase');
    }

    this._checkValidClient(clientId);

    this.clients[clientId].factionId;

    //TODO
  }


  //-validation methods
  _checkValidClientName(name, clientId) {
    if(!name) {
      throw new Error('Client required a name');
    }

    Object.values(this.clients).some(client => {
      if(client.id !== clientId && client.name === name) {
        throw new Error('Client name already in use by another client');
      }
    });
  }

  _checkValidClient(clientId) {
    if(!this.clients[clientId]) {
      throw new Error('Unknown client');
    }
  }


  /////////////////////
  // Getters/setters //
  /////////////////////



  ////////////////////
  // public methods //
  ////////////////////

  onMessage(type, data, clientId) {
    const name = `message_${type}`;

    if(this[name]) {
      return this[name](data, clientId);
    }

    console.log('Unknown message from client: ', type, data, clientId);
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

  createColony(systemBodyId, factionId, minerals = {}, structures = {}, populationIds = []) {
    const systemBody = this.entities[systemBodyId];
    const faction = this.entities[factionId];

    const colony = this._newEntity('colony', {
      factionId,
      systemId: systemBody.systemId,
      systemBodyId: systemBody.id,
      factionSystemBodyId: getFactionSystemBodyFromFactionAndSystemBody(faction, systemBody, this.entities).id,
      researchGroupIds: [],//groups performing research
      populationIds,
      colony: {
        structures,
        minerals,
        researchInProgress: {},//progress on research projects on this colony

        buildQueue: [],
        capabilityProductionTotals: {},
        structuresWithCapability: {},
        populationCapabilityProductionTotals: {},
        populationStructuresWithCapability: {},
        populationUnitCapabilityProduction: {},
      }
    });

    //update faction
    faction.faction.colonyIds.push(colony.id);
    this.entitiesLastUpdated[factionId] = this.gameTime + 1;//mark faction as updated

    return colony;
  }

  createResearchGroup(colonyId, structures, projects) {
    const colony = this.getEntityById(colonyId, 'colony');

    if(!colony) {
      throw new Error('cannot create research group, invalid colonyId');
    }

    const researchGroup = this._newEntity('researchGroup', {
      factionId: colony.factionId,
      colonyId: colony.id,


      researchGroup: {
        structures,//describes what this group would like to use - what they get depends on what is available - groups are assigned structures based on order
        projects//array of research projects IDs, to be performed in order
      }
    });

    return researchGroup;
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
    this.entitiesLastUpdated[colonyId] = this.gameTime + 1;//mark faction as updated
    this.entitiesLastUpdated[populationId] = this.gameTime + 1;//mark faction as updated
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

    this.entitiesLastUpdated[colonyId] = this.gameTime + 1;//mark as updated
  }


  /////////////////////////////
  // Internal helper methods //
  /////////////////////////////

  _updateGameTime() {
    let newGameSpeed = 5;
    let isPaused = false;

    Object.values(this.clients).forEach(client => {
      newGameSpeed = Math.min(newGameSpeed, client.gameSpeed);
      isPaused = isPaused || client.isPaused;
    });

    switch(newGameSpeed) {
      case 1:
        this.timeMultiplier = 1;
        this.gameSecondsPerStep = 1;
        break;
      case 2:
        this.timeMultiplier = 60;
        this.gameSecondsPerStep = 1;
        break;
      case 3:
        this.timeMultiplier = 3600;
        this.gameSecondsPerStep = 1;
        break;
      case 4:
        this.timeMultiplier = 86400;
        this.gameSecondsPerStep = 60;
        break;
      case 5:
        this.timeMultiplier = 7 * 86400;
        this.gameSecondsPerStep = 360;
        break;
    }

    this.gameSpeed = newGameSpeed;
    this.isPaused = isPaused;
  }

  _onTick = (elapsedTime) => {
    this._updateGameTime();

    if(!this.isPaused) {
      const effectiveElapsedTime = elapsedTime * this.timeMultiplier;

      this.totalElapsedTime += effectiveElapsedTime;

      this._advanceTime(this.gameSecondsPerStep);
    }

    Object.values(this.clients).forEach(client => {
      this.connector.sendMessageToClient(client.id, 'updatingGame', this._getClientState(client.id));
    });
  }

  _advanceTime(step = 1) {
      //Initial performance mark
    performance.mark('advanceTime');

    const entities = this.entities;

    const entityIds = this.entityIds;
    const entitiesLastUpdated = this.entitiesLastUpdated;
    const numEntities = entityIds.length;
    let processors = null;

    if(step === null) {
      //initial entity initialisation
      processors = this._getEntityProcessors(this.gameTime, this.gameTime, true);

      for(let j = 0; j < numEntities; ++j) {
        processors(entities[entityIds[j]], entities);
      }

      return;
    }

    const advanceToTime = Math.floor(this.totalElapsedTime);

    while(this.gameTime < advanceToTime) {
      let lastGameTime = this.gameTime;

      //update game time
      this.gameTime = Math.min(this.gameTime + step, advanceToTime);

      const gameTime = this.gameTime;

      let processors = this._getEntityProcessors(lastGameTime, gameTime);
      let result;

      //for each entity
      for(let i = 0; i < numEntities; ++i) {
        let entityId = entityIds[i];
        result = processors(entities[entityId], entities);

        if(result) {
          //this entity was mutated
          entitiesLastUpdated[entityId] = gameTime;

          if(result instanceof Array) {
            result.forEach(id => {
              entitiesLastUpdated[id] = gameTime;
            });
          }
        }
      }
    }

    // Measure performance and store results
    performance.measure('advanceTime execution time step = '+step, 'advanceTime');

    window._measuredPerformance.push(performance.getEntriesByType("measure")[0]);

    // Finally, clean up the entries.
    performance.clearMarks();
    performance.clearMeasures();
  }

  _getEntityProcessors(lastGameTime, gameTime, init = false) {

    //create entity processors
    const entityProcessors = this.entityProcessorFactories.map(factory => (factory(lastGameTime, gameTime, init))).filter(processor => (!!processor));

    //create composed function for processing all entities
    //called for each entity - any processor the mutates the entity must return true
    return (entity, entities) => {
      let entityWasMutated = false;

      for(let i = 0, l = entityProcessors.length; i < l;++i) {
        entityWasMutated = entityProcessors[i](entity, entities, this.gameConfig) || entityWasMutated;
      }

      return entityWasMutated;
    }
  }

  _getClientState(clientId, full = false) {
    const gameTime = this.gameTime;
    const entities = this.entities;
    const entitiesLastUpdated = this.entitiesLastUpdated;
    const client = this.clients[clientId];
    const factionId = client.factionId;

    const entityIds = this.entityIds;
    const clientLastUpdated = this.clientLastUpdatedTime[clientId];

    //if no clientLastUpdatedTime, then get full state
    full = full || !clientLastUpdated;

    //entities to be sent
    const clientEntities = {};

    for(let i = 0, l = entityIds.length; i < l; ++i) {
      let entityId = entityIds[i];
      let entity = entities[entityId];
      let entityLastUpdatedTime = entitiesLastUpdated[entityId];

      if(full || (entityLastUpdatedTime > clientLastUpdated)) {
        //Filter to just entities that do not have a factionId AND entities that have the clients faction id
        if(!entity.factionId || entity.factionId === factionId) {
          clientEntities[entity.id] = entity;
        }
      }
    }

    //record last updated time
    this.clientLastUpdatedTime[clientId] = gameTime;

    //output state to client
    return {entities: clientEntities, gameTime, gameSpeed: this.gameSpeed, desiredGameSpeed: client.gameSpeed, isPaused: this.isPaused, factionId: client.factionId};
  }

  _newEntity(type, props) {
    const newEntity = {
      ...props,
      id: this.entityId++,
      type,
    };

    this.entities[newEntity.id] = newEntity;
    this.entityIds.push(newEntity.id);
    this.entitiesLastUpdated[newEntity.id] = this.gameTime + 1;

    //automatically add ref to this entity in linked entities
    //-props to check for links
    const idProps = ['factionId', 'speciesId', 'systemBodyId', 'systemId', 'speciesId', 'factionSystemId', 'factionSystemBodyId', 'colonyId'];

    for(let i = 0; i < idProps.length; i++) {
      const prop = idProps[i];

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
          this.entitiesLastUpdated[linkedEntity.id] = this.gameTime + 1;
        }
      }
    }

    return newEntity;
  }

  _removeEntity(entity) {
    if(typeof(entity) === 'object') {
      entity = entity.id;
    }

    if(this.entities[entity]) {
      this.entityIds.splice(this.entityIds.indexOf(entity), 1);

      delete this.entities[entity];
    }
  }

  _getClientsForFaction(factionId, roles = null) {
    return Object.values(this.clients).reduce((output, client) => {
      if(client.factions[factionId]) {
        if(!roles || roles.includes(client.factions[factionId])) {
          output.push(client.id);
        }
      }

      return output;
    }, [])
  }
}
