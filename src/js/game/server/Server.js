import resolvePath from '@/helpers/object/resolve-path';
import map from '@/helpers/object/map';
import isEmpty from '@/helpers/object/isEmpty';

import createWorldFromDefinition from './createWorldFromDefinition';
//import * as entityCacheTypes from './entityCacheTypes';
import * as FactionClientTypes from '../FactionClientTypes';

import movementFactory from './entityProcessorFactories/movement';


//Server phases
const INITIALISING = 'initialising';
const CONNECTING = 'connecting';
const RUNNING = 'running';

const global = typeof(window) === 'object' ? window : {};


export default class Server {
  connector = null;

  phase = INITIALISING;

  gameTime = null;
  gameSpeed = 3600;//3 * 24 * 3600;//time multiplyer
  gameSecondsPerStep = 1;//60;//game seconds to process per step - higher = less processing, but risks resolution based issues

  factions;//e.g. The in-game factions Humans, martians (factions are also entities)
  clients;//a client is a player connected to a faction by a connector method with a permissions e.g. Bob spectating Martians on connectionId 1

  entities = null;
  entityId = null;//used to keep track of assigned entity IDs - increments after each entity is created
  entityIds = null;
  entitiesLastUpdated = null;

  entityProcessorFactories = [movementFactory];

  clientLastUpdatedTime = null

  constructor(connector) {
    this.connector = connector;
  }

  //////////////////////
  // message handlers //
  //////////////////////

  //-initialising server
  message_createWorld(definition, connectionId) {
    if(this.phase !== INITIALISING) {
      throw new Error('Can only create world while Server is in "initialising" phase');
    }

    //c/onsole.log('[Server] createWorld: ', definition, connectionId);
    this.gameTime = Math.floor(new Date(definition.startDate).valueOf() / 1000);

    //initialise the world based on supplied definition
    this.factions = {};
    this.clients = {};
    this.entityId = 1;
    this.entities = {};
    this.entityIds = [];
    this.clientLastUpdatedTime = {};
    this.entitiesLastUpdated = {};
    createWorldFromDefinition(this, definition);

    //c/onsole.log('[Server] created world: ', this.entities);



    this._advanceTime(null);

    //Now waiting for players to connect
    this.phase = CONNECTING;

    //broadcast to players that state has updated
    this.connector.broadcastToClients('phaseChanged', this.phase);

    //Report back to clients that game is ready
    return Promise.resolve();
  }

  message_connectClient({name}, connectionId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only connect player while Server is in "connecting" phase');
    }

    if(this.clients[connectionId]) {
      throw new Error('Each client can only connect once');
    }

    //check client name is valid
    this._checkValidClientName(name, connectionId);

    //c/onsole.log('[Server] connectClient: ', name, connectionId);

    //create a client
    //factions are the available factions (id: role hash), factionId is the actual faction they are connected as right now
    this.clients[connectionId] = {name, id: connectionId, type: 'human', ready: false, factions: {}, factionId: null, gameTime: this.gameTime};

    //Broadcast updated clients info
    this.connector.broadcastToClients('clientConnected', this.clients);

    //return game details to newly connected client
    return Promise.resolve({entities: this.entities, factions: this.factions, clients: this.clients})
  }

  message_setClientSettings({name, factions, factionId, ready}, connectionId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only set connected player settings while Server is in "connecting" phase');
    }

    this._checkValidClient(connectionId);
    this._checkValidClientName(name, connectionId);

    //TODO check that name is unique

    const client = this.clients[connectionId];




    //TODO check that client settings are valid e.g. is connecting to valid faction(s) not already controlled by someone else
    if(factions === null || isEmpty(factions)) {
      //joining as spectator
      factions = map(this.factions, (faction) => (FactionClientTypes.SPECTATOR));
    } else {
      if(Object.keys(factions).some(factionId => {
        return this._getClientsForFaction(factionId, [FactionClientTypes.OWNER]).some(clientId => (clientId !== connectionId));
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

    //c/onsole.log('[Server] setClientSettings: ', name, factions, factionId, ready, connectionId);

    ready = !!ready;

    //update state
    this.clients[connectionId] = {...client, name, factions, factionId, ready};

    //broadcast updated state to all players
    this.connector.broadcastToClients('clientUpdated', this.clients);

    //new settings applied successfully
    return Promise.resolve(true);
  }

  message_startGame(data, connectionId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only start game while Server is in "connecting" phase');
    }

    this._checkValidClient(connectionId);

    const client = this.clients[connectionId];


    //c/onsole.log('[Server] startGame');
    this.phase = RUNNING;

    //Only only start game if all players are ready
    if(Object.values(this.clients).every(client => (client.ready))) {
      //For each client, tell them the game is starting and send them their client state
      Object.values(this.clients).forEach(client => {
        this.connector.sendMessageToClient(client.id, 'startingGame', this._getClientState(client.id, true));
      });

      this._lastTime = Date.now();

      console.log(global);


      if(global && global.requestAnimationFrame) {
        const play = () => {
          //stop if no longer in running phase
          if(this.phase !== RUNNING) {
            return;
          }

          const now = Date.now();
          const elapsedTime = (now - this._lastTime)/1000;

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
  message_getClientState(lastUpdateTime, connectionId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only get client state while server is in "running" phase');
    }

    this._checkValidClient(connectionId);

    return Promise.resolve(this._getClientState(connectionId, true))
  }

  //-validation methods
  _checkValidClientName(name, connectionId) {
    if(!name) {
      throw new Error('Client required a name');
    }

    Object.values(this.clients).some(client => {
      if(client.id !== connectionId && client.name === name) {
        throw new Error('Client name already in use by another client');
      }
    });
  }

  _checkValidClient(connectionId) {
    if(!this.clients[connectionId]) {
      throw new Error('Unknown client');
    }
  }


  /////////////////////
  // Getters/setters //
  /////////////////////



  ////////////////////
  // public methods //
  ////////////////////

  onMessage(type, data, connectionId) {
    const name = `message_${type}`;

    if(this[name]) {
      return this[name](data, connectionId);
    }

    console.log('Unknown message from client: ', type, data, connectionId);
  }

  getEntityById(id) {
    return this.entities[id];
  }

  getEntitiesByIds(ids) {
    const entities = this.entities;

    return ids.map(id => (entities[id]));
  }


  /////////////////////////////
  // Internal helper methods //
  /////////////////////////////

  _onTick = (elapsedTime) => {

    this._advanceTime(Math.min(3600, Math.ceil(elapsedTime * this.gameSpeed)), this.gameSecondsPerStep);

    Object.values(this.clients).forEach(client => {
      this.connector.sendMessageToClient(client.id, 'updatingGame', this._getClientState(client.id));
    });
  }

  _advanceTime(elapsedTime, step = 1) {
    const entities = this.entities;

    const entityIds = this.entityIds;
    const entitiesLastUpdated = this.entitiesLastUpdated;
    const numEntities = entityIds.length;
    let processors = null;

    if(elapsedTime === null) {
      //initial entity initialisation
      processors = this._getEntityProcessors();

      for(let j = 0; j < numEntities; ++j) {
        processors(entities[entityIds[j]], entities);
      }

      return;
    }

    //TODO step shouldn't take use past the elapsed time e.g. elapsed time 21, step = 3 - 3rd step should be 1, not 10
    for(let i = 0; i < elapsedTime; i += step) {
      //update game time
      this.gameTime += step;
      const gameTime = this.gameTime;

      let processors = this._getEntityProcessors();

      //for each entity
      for(let j = 0; j < numEntities; ++j) {
        let entityId = entityIds[j];

        if(processors(entities[entityId], entities)) {
          //this entity was mutated
          entitiesLastUpdated[entityId] = gameTime;
        }
      }
    }
  }

  _getEntityProcessors() {
    const gameTime = this.gameTime;

    //create entity processors
    const entityProcessors = this.entityProcessorFactories.map(factory => (factory(gameTime)));

    //create composed function for processing all entities
    //called for each entity - any processor the mutates the entity must return true
    return (entity, entities) => {
      let entityWasMutated = false;

      for(let i = 0, l = entityProcessors.length; i < l;++i) {
        entityWasMutated = entityProcessors[i](entity, entities) || entityWasMutated;
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

      if(full || (entityLastUpdatedTime > clientLastUpdated) || entityLastUpdatedTime === null) {
        //Filter to just entities that do not have a factionId AND entities that have the clients faction id
        if(!entity.factionId || entity.factionId === factionId) {
          clientEntities[entity.id] = entity;
        }
      }
    }

    //record last updated time
    this.clientLastUpdatedTime[clientId] = gameTime;

    //output state to client
    return {entities: clientEntities, gameTime};
  }

  _newEntity(type, props) {
    const newEntity = {
      ...props,
      id: this.entityId++,
      type,
    };

    this.entities[newEntity.id] = newEntity;
    this.entityIds.push(newEntity.id);
    this.entitiesLastUpdated[newEntity.id] = this.gameTime - 1;//never updated

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
