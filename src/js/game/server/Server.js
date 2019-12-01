import resolvePath from '@/helpers/object/resolve-path';
import map from '@/helpers/object/map';
import forEach from '@/helpers/object/forEach';
import filter from '@/helpers/object/filter';
import isEmpty from '@/helpers/object/isEmpty';
import inPlaceReorder from '@/helpers/array/in-place-reorder';
import toString from '@/helpers/string/to-string';

import createWorldFromDefinition from './createWorldFromDefinition';
//import * as entityCacheTypes from './entityCacheTypes';
import * as FactionClientTypes from '../FactionClientTypes';

import orbitProcessorFactory from './entityProcessorFactories/orbit';
import shipMovementFactory from './entityProcessorFactories/shipMovement';
import colonyCapabilitiesFactory from './entityProcessorFactories/colonyCapabilities';
import populationGrowthFactory from './entityProcessorFactories/populationGrowth';
import miningFactory from './entityProcessorFactories/mining';
import mineralExtractionFactory from './entityProcessorFactories/mineralExtraction';
import researchFactory from './entityProcessorFactories/research';
import factionCompletedResearch from './entityProcessorFactories/factionCompletedResearch';
import updateResearchQueue from './entityProcessorFactories/updateResearchQueue';
import constructionFactory from './entityProcessorFactories/construction';
import shipBuildingFactory from './entityProcessorFactories/shipBuilding';

import NameGenerator from '@/game/NameGenerator';
import EntityManager from '@/game/server/EntityManager';
import RTCManager from '@/game/server/RTCManager';


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
  constructionProjects;
  rtcManager = null
  systemBodyTypeMineralAbundance;

  gameConfig;

  entityManager;

  entityProcessors = [
    orbitProcessorFactory(),//-done
    shipMovementFactory(),
    populationGrowthFactory(),//-done //TODO combine with colonyCapabilitiesFactory
    colonyCapabilitiesFactory(),//-done
    constructionFactory(),
    miningFactory(),//-done
    mineralExtractionFactory(),//-done
    researchFactory(),
    factionCompletedResearch(),
    updateResearchQueue(),
    shipBuildingFactory()
  ];

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

    //TODO different factions have different naming systems??
    this.nameGenerator = new NameGenerator(null);

    //initialise the world based on supplied definition
    this.entityManager = new EntityManager(this.gameTime, this.entityProcessors, this.nameGenerator);
    this.factions = {};
    this.clients = {};
    this.rtcManager = new RTCManager();

    this.clientLastUpdatedTime = {};
    createWorldFromDefinition(this, definition);

    this.gameConfig = {
      minerals: this.minerals,
      structures: this.structures,
      constructionProjects: this.constructionProjects,
      researchAreas: this.rtcManager.researchAreas,
      research: this.rtcManager.research,
      technology: this.rtcManager.technology,
      componentTypes: this.rtcManager.componentTypes,
    };

    //c/onsole.log('[Server] created world: ', this.entityManager.entities);

    this._advanceTime(null);

    //Now waiting for players to connect
    this.phase = CONNECTING;

    //broadcast to players that state has updated
    this.connector.broadcastToClients('phaseChanged', this.phase);

    //Report back to clients that game is ready
    return Promise.resolve();
  }

  message_connectClient({name}, clientId) {
    this._checkPhase(CONNECTING);

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
      factions: this.factions,
      clients: this.clients,
      minerals: this.minerals,
      constructionProjects: this.constructionProjects,
      structures: this.structures,
      research: this.rtcManager.getGenericResearch(),
      researchAreas: this.rtcManager.researchAreas,
      technology: this.rtcManager.getGenericTechnology(),
      componentTypes: this.rtcManager.componentTypes,
      components: this.rtcManager.getGenericComponents(),
    })
  }

  message_setClientSettings({name, factions, factionId, ready}, clientId) {
    this._checkPhase(CONNECTING);
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

    //TODO update with faction specific tech and research

    //new settings applied successfully
    return Promise.resolve(true);
  }

  message_startGame(data, clientId) {
    this._checkPhase(CONNECTING);

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
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);

    return Promise.resolve(this._getClientState(clientId, true))
  }

  message_setDesiredSpeed(newDesiredSpeed, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);

    this.clients[clientId].gameSpeed = Math.max(1, Math.min(5, newDesiredSpeed|0))
  }

  message_setIsPaused(newIsPaused, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);

    this.clients[clientId].isPaused = !!newIsPaused;
  }

  message_createColony(systemBodyId, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);

    const colony = this.entityManager.createColony(systemBodyId, this.clients[clientId].factionId);

    return Promise.resolve(colony.id);
  }

  //Research
  message_createResearchQueue({colonyId, structures, researchIds}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, colonyId);

    const colony = this.entityManager.getEntityById(colonyId, 'colony');

    if(!colony.colony) {
      throw new Error('Not a valid colony');
    }

    const researchQueue = this.entityManager.createResearchQueue(colonyId, structures || {}, researchIds || []);

    return Promise.resolve(researchQueue.id);
  }

  message_removeResearchQueue(researchQueueId, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, researchQueueId);

    const researchQueue = this.entityManager.getEntityById(researchQueueId, 'researchQueue');

    //check that this is a valid research queue
    if(!researchQueue.researchQueue) {
      throw new Error('Not a valid research queue');
    }

    //remove this entity
    this.entityManager.removeEntity(researchQueueId);

    return Promise.resolve(researchQueue.id);
  }

  message_updateResearchQueue({researchQueueId, structures, researchIds}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, researchQueueId);

    const researchQueue = this.entityManager.getEntityById(researchQueueId, 'researchQueue');

    //check that this is a valid research queue
    if(!researchQueue.researchQueue) {
      throw new Error('Not a valid research queue');
    }

    //Alter entity
    researchQueue.researchQueue.structures = structures;
    researchQueue.researchQueue.researchIds = researchIds;

    this.entityManager.alteredEntity(researchQueue);

    return Promise.resolve(researchQueue.id);
  }

  message_addBuildQueueItem({colonyId, constructionProjectId, total, assignToPopulationId, takeFromPopulationId}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, colonyId);
    this._clientOwnsEntity(clientId, assignToPopulationId);
    takeFromPopulationId && this._clientOwnsEntity(clientId, takeFromPopulationId);

    const colony = this.entityManager.getEntityById(colonyId, 'colony');

    if(!colony.colony) {
      throw new Error('Not a valid colony');
    }

    const constructionProject = this.constructionProjects[constructionProjectId];

    if(!constructionProject) {
      throw new Error('Unknown constructionProjectId: '+ constructionProjectId);
    }

    //Add the construction queue
    const newId = this.entityManager.nextId();

    colony.colony.buildQueue.push({
      id: newId,//re-using entity ID, even though it's not an entity - is that a problem?
      total,
      completed: 0,
      constructionProjectId,
      assignToPopulationId, takeFromPopulationId
    })

    //make sure colony props are valid
    if(!colony.colony.structures[assignToPopulationId]) {
      colony.colony.structures[assignToPopulationId] = {};
    }

    forEach(constructionProject.producedStructures || {}, (quantity, structureId) => {
      if(!colony.colony.structures[assignToPopulationId][structureId]) {
        colony.colony.structures[assignToPopulationId][structureId] = 0;
      }
    })

    this.entityManager.alteredEntity(colony);

    return Promise.resolve(newId);
  }

  message_removeBuildQueueItem({colonyId, id}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, colonyId);

    const colony = this.entityManager.getEntityById(colonyId, 'colony');

    if(!colony.colony) {
      throw new Error('Not a valid colony');
    }

    const buildQueueItemIndex = colony.colony.buildQueue.findIndex(item => item.id === id);

    if(buildQueueItemIndex === -1) {
      return Promise.resolve(false);
    }

    //everything is valid, remove build queue item
    colony.colony.buildQueue.splice(buildQueueItemIndex, 1);

    this.entityManager.alteredEntity(colony);

    //return new build queue
    return Promise.resolve(colony.colony.buildQueue);
  }

  message_reorderBuildQueueItem({colonyId, id, newIndex}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, colonyId);

    const colony = this.entityManager.getEntityById(colonyId, 'colony');

    if(!colony.colony) {
      throw new Error('Not a valid colony');
    }

    const buildQueueItemIndex = colony.colony.buildQueue.findIndex(item => item.id === id);

    if(buildQueueItemIndex === -1) {
      return Promise.resolve(false);
    }

    //everything is valid, reorder build queue
    inPlaceReorder(colony.colony.buildQueue, buildQueueItemIndex, newIndex);

    this.entityManager.alteredEntity(colony);

    //return new build queue
    return Promise.resolve(colony.colony.buildQueue);
  }

  message_updateBuildQueueItem({colonyId, id, total, assignToPopulationId, takeFromPopulationId}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);
    this._clientOwnsEntity(clientId, colonyId);
    this._clientOwnsEntity(clientId, assignToPopulationId);
    takeFromPopulationId && this._clientOwnsEntity(clientId, takeFromPopulationId);

    const colony = this.entityManager.getEntityById(colonyId, 'colony');

    if(!colony.colony) {
      throw new Error('Not a valid colony');
    }

    const buildQueueItemIndex = colony.colony.buildQueue.findIndex(item => item.id === id);

    if(buildQueueItemIndex === -1) {
      return Promise.resolve(false);
    }

    const buildQueueItem = colony.colony.buildQueue[buildQueueItemIndex];

    //make sure colony props are valid
    if(!colony.colony.structures[assignToPopulationId]) {
      colony.colony.structures[assignToPopulationId] = {};
    }

    const constructionProject = this.constructionProjects[buildQueueItem.constructionProjectId];

    forEach(constructionProject.producedStructures, (quantity, structureId) => {
      if(!colony.colony.structures[assignToPopulationId][buildQueueItem.constructionProjectId]) {
        colony.colony.structures[assignToPopulationId][buildQueueItem.constructionProjectId] = 0;
      }
    })

    //everthing is valid, update build queue item
    buildQueueItem.total = total;
    buildQueueItem.assignToPopulationId = assignToPopulationId;
    buildQueueItem.takeFromPopulationId = takeFromPopulationId;

    this.entityManager.alteredEntity(colony);

    //return new build queue
    return Promise.resolve(colony.colony.buildQueue);
  }

  message_addComponentProject({name, componentTypeId, componentOptions}, clientId) {
    this._checkPhase(RUNNING);
    this._checkValidClient(clientId);

    const faction = this._getFactionForClient(clientId);

    return Promise.resolve(this.rtcManager.addFactionComponent(faction, name, componentTypeId, componentOptions));
  }


  //-validation methods
  _clientOwnsEntity(clientId, entity) {
    if(typeof(entity) !== 'object') {
      entity = this.entityManager.getEntityById(entity);
    }

    if(!entity) {
      throw new Error('Entity not found');
    }

    if(this.clients[clientId].factionId !== entity.factionId) {
      throw new Error('Client does not control this entity');
    }
  }

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

  _checkPhase(phase, msg = null) {
    if(this.phase !== phase) {
      throw new Error(msg || `Incorrect phase, was: ${this.phase}, required: ${phase}`);
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

    const entityManager = this.entityManager;
    const allAlteredEntities = new Set();

    if(step === null) {
      //initial entity initialisation
      this.entityProcessors.forEach(entityProcessor => entityProcessor.processEntitites(allAlteredEntities, this.gameTime, this.gameTime, entityManager, this.gameConfig, true, true));

      //mark all altered entities as altered
      entityManager.alteredEntities(allAlteredEntities)

      return;
    }

    const advanceToTime = Math.floor(this.totalElapsedTime);

    while(this.gameTime < advanceToTime) {
      let lastGameTime = this.gameTime;

      //update game time
      const gameTime = entityManager.gameTime = this.gameTime = Math.min(this.gameTime + step, advanceToTime);

      this.entityProcessors.forEach(entityProcessor => {
        entityProcessor.processEntitites(allAlteredEntities, lastGameTime, gameTime, entityManager, this.gameConfig, false, gameTime === advanceToTime);
      });
    }

    //mark all altered entities as altered
    entityManager.alteredEntities(allAlteredEntities)

    // Measure performance and store results
    performance.measure('advanceTime execution time step = '+step, 'advanceTime');

    window._measuredPerformance.push(performance.getEntriesByType("measure")[0]);

    // Finally, clean up the entries.
    performance.clearMarks();
    performance.clearMeasures();
  }

  _getClientState(clientId, full = false) {
    clientId = clientId.toString();

    const gameTime = this.gameTime;
    const entities = this.entityManager.entities;
    const entitiesLastUpdated = this.entityManager.entitiesLastUpdated;
    const client = this.clients[clientId];
    const factionId = client.factionId;

    const entityIds = this.entityManager.entityIds;
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

    //removed entities
    const removedEntities = [];

    for(var removedEntityId in this.entityManager.entitiesRemoved) {
      const removedEntityClientsToInformSet = this.entityManager.entitiesRemoved[removedEntityId];

      //If this client hasn't been told about this entity being removed, do so now
      if(removedEntityClientsToInformSet.has(clientId)) {
        //add to update data
        removedEntities.push(removedEntityId);

        //remove this client form list to be informed
        removedEntityClientsToInformSet.delete(clientId)

        if(removedEntityClientsToInformSet.count === 0) {
          //everyone told about this, remove from list - not 100% happy about this being here
          delete this.entityManager.entitiesRemoved[removedEntityId];
        }
      }
    }

    //record last updated time
    this.clientLastUpdatedTime[clientId] = gameTime;

    //output state to client
    return {
      entities: clientEntities,
      removedEntities,
      gameTime,
      gameSpeed: this.gameSpeed,
      desiredGameSpeed: client.gameSpeed,
      isPaused: this.isPaused,
      factionId: client.factionId,

      research: this.rtcManager.getResearchUpdatesFor(factionId),
      technology: this.rtcManager.getTechnologyUpdatesFor(factionId),
      components: this.rtcManager.getComponentUpdatesFor(factionId),
    };
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

  _getFactionForClient(clientId) {
    const client = this.clients[clientId];

    if(!client) {
      throw new Error('Unknown client');
    }

    const faction = this.factions[client.factionId];

    if(!faction) {
      throw new Error('Client does not have associated faction');
    }

    return faction;
  }
}
