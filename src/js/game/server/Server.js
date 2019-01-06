import resolvePath from '@/helpers/object/resolve-path';
import map from '@/helpers/object/map';
import isEmpty from '@/helpers/object/isEmpty';

import createWorldFromDefinition from './createWorldFromDefinition';
import * as entityCacheTypes from './entityCacheTypes';
import * as FactionClientTypes from '../FactionClientTypes';

import movementFactory from './entityProcessorFactories/movement';


//Server phases
const INITIALISING = 'initialising';
const CONNECTING = 'connecting';
const RUNNING = 'running';


export default class Server {
  connector = null;

  phase = INITIALISING;

  factions = {};//e.g. The in-game factions Humans, martians (factions are also entities)
  clients = {};//a client is a player connected to a faction by a connector method with a permissions e.g. Bob spectating Martians on connectionId 1

  entities = {};
  entityCache = {};

  entityId = 1;
  entityCacheDirty = false;
  entityIds = null;

  entityProcessorFactories = [movementFactory];

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

    //initialise the world based on supplied definition
    createWorldFromDefinition(this, definition);

    //c/onsole.log('[Server] created world: ', this.entities);

    this.gameTime = new Date(definition.startDate);

    this._advanceTime(null);
    //this.entities = map(this.entities, this._getEntityProcessors());

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
        this.connector.sendMessageToClient(client.id, 'startingGame', this._getClientState(client.id));
      });

      /*
      //45-50 ~20/millisecond
      //43-47
      //42-47
      //30-33 ~30/millisecond
      const start = performance.now();

      this._advanceTime(1000);

      const end = performance.now();

      alert('[PERF] '+(end - start));
      //*/

      /*
      setTimeout(() => {
        performance.mark('advanceTime-start');

        this._advanceTime(1000);

        performance.mark('advanceTime-end');

        performance.measure(
          "advanceTime",
          "advanceTime-start",
          "advanceTime-end"
        );
      }, 1000);
      //*/

      let lastTime = null;
      const speed = 86400;
      const step = 3600//86400;

      const play = (timestamp) => {
        if(lastTime !== null) {
          const elapsedTime = (timestamp - lastTime) /1000;

          this._advanceTime(Math.min(3600, Math.ceil(elapsedTime * speed)), step);

          Object.values(this.clients).forEach(client => {
            this.connector.sendMessageToClient(client.id, 'updatingGame', this._getClientState(client.id));
          });
        }

        lastTime = timestamp

        window.requestAnimationFrame(play);
      };

      window.requestAnimationFrame(play);


      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  //-in game
  message_getClientState(data, connectionId) {
    if(this.phase !== RUNNING) {
      throw new Error('Can only get client state while server is in "running" phase');
    }

    this._checkValidClient(connectionId);

    return Promise.resolve(this._getClientState(connectionId))
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

  /*getCachedEntities(...cachePath) {
    const entityCacheTypeName = cachePath[0];
    const entities = this.entities;
    const entityCache = this.entityCache;

    if(this.entityCacheDirty) {
      //clear entity cache
      for(let i = 0, k = Object.keys(entityCache), l = k.length; i < l; ++i) {
        entityCache[k[i]] = null;
      }

      //rebuild and cache ids list
      this.entityIds = Object.keys(entities);

      this.entityCacheDirty = false;
    }

    //Only create caches when you need them
    if(!entityCache.hasOwnProperty(entityCacheTypeName)) {
      //rebuild this cache
      entityCache[entityCacheTypeName] = entityCacheTypes[entityCacheTypeName](entities, this.entityIds);
    }

    //get the requested data
    return resolvePath(entityCache, cachePath);
  }*/


  /////////////////////////////
  // Internal helper methods //
  /////////////////////////////

  _advanceTime(elapsedTime, step = 1) {
    const entities = this.entities;

    if(this.entityCacheDirty) {
      this.entityIds = Object.keys(entities);

      this.entityCacheDirty = false;
    }

    const entityIds = this.entityIds;
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

    for(let i = 0; i < elapsedTime; i += step) {
      //update game time
      this.gameTime.setSeconds(this.gameTime.getSeconds() + step);

      let processors = this._getEntityProcessors();

      for(let j = 0; j < numEntities; ++j) {
        processors(entities[entityIds[j]], entities);
      }

      //update the game entities
      //newEntities = map(this.entities, this._getEntityProcessors());
    }

    //this.entities = newEntities;
  }

  _getEntityProcessors() {
    const gameTime = this.gameTime;

    //create entity processors
    const entityProcessors = this.entityProcessorFactories.map(factory => (factory(gameTime / 1000)));

    //create composed function for processing all entities
    //entity processors are currently mutating objects - could clone the object once at the start if needed? although it would only be a shallow clone
    return (entity, entities) => {
      //entity = {...entity};

      for(let i = 0, l = entityProcessors.length; i < l;++i) {
        entity = entityProcessors[i](entity, entities)
      }

      return entity;
    }
  }

  _getClientState(clientId) {
    const entities = this.entities;
    const client = this.clients[clientId];
    const factionId = client.factionId;


    if(this.entityCacheDirty) {
      this.entityIds = Object.keys(entities);

      this.entityCacheDirty = false;
    }

    const entityIds = this.entityIds;

    const clientEntities = {};

    for(let i = 0, l = entityIds.length; i < l; ++i) {
      let entity = entities[entityIds[i]];

      //Filter to just entities that do not have a factionId AND entities that have the clients faction id
      if(!entity.factionId || entity.factionId === factionId) {
        clientEntities[entity.id] = entity;
      }
    }

    return {entities: clientEntities, gameTime: this.gameTime.valueOf()};
  }

  _newEntity(type, props) {
    const newEntity = {
      ...props,
      id: this.entityId++,
      type,
    };

    this.entities[newEntity.id] = newEntity;
    this.entityCacheDirty = true;

    return newEntity;
  }

  _removeEntity(entity) {
    if(typeof(entity) === 'object') {
      entity = entity.id;
    }

    this.entityCacheDirty = true;

    delete this.entities[entity];
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
