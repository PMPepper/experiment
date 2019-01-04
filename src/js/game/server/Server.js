import resolvePath from '@/helpers/object/resolve-path';
import map from '@/helpers/object/map';
import isEmpty from '@/helpers/object/isEmpty';

import createWorldFromDefinition from './createWorldFromDefinition';
import * as entityCacheTypes from './entityCacheTypes';
import * as FactionClientTypes from '../FactionClientTypes';


//Server phases
const INITIALISING = 'initialising';
const CONNECTING = 'connecting';


export default class Server {
  connector = null;

  _phase = INITIALISING;

  factions = {};//e.g. The in-game factions Humans, martians (factions are also entities)
  clients = {};//a client is a player connected to a faction by a connector method with a permissions e.g. Bob spectating Martians on connectionId 1

  entities = {};
  entityCache = {};

  entityId = 1;
  entityCacheDirty = false;
  entityIds = null;

  constructor(connector) {
    this.connector = connector;
  }

  //message handlers
  message_createWorld(definition, connectionId) {
    if(this.phase !== INITIALISING) {
      throw new Error('Can only create world while Server is in "initialising" phase');
    }

    console.log('[Server] createWorld: ', definition, connectionId);

    //initialise the world based on supplied definition
    createWorldFromDefinition(this, definition);

    //Now waiting for players to connect - will broadcast to clients
    this.phase = CONNECTING;

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

    //TODO check client name is valid

    console.log('[Server] connectClient: ', name, connectionId);

    //create a client
    //factions are the available factions (id: role hash), factionId is the actual faction they are connected as right now
    this.clients[connectionId] = {name, id: connectionId, type: 'human', ready: false, factions: {}, factionId: null};

    //Broadcast updated clients info
    this.connector.broadcastToClients('clientConnected', this.clients);

    //return game details to newly connected client
    return Promise.resolve({entities: this.entities, factions: this.factions, clients: this.clients})
  }

  message_setClientSettings({name, factions, factionId, ready}, connectionId) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only set connected player settings while Server is in "connecting" phase');
    }

    if(!name) {
      throw new Error('Client must have a name');
    }

    //TODO check that name is unique

    const client = this.clients[connectionId];

    if(!client) {
      throw new Error('Unknown client');
    }


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

    console.log('[Server] setClientSettings: ', name, factions, factionId, ready, connectionId);

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

    const client = this.clients[connectionId];

    if(!client) {
      throw new Error('Unknown client');
    }

    console.log('[Server] startGame');

    //Only only start game if all players are ready
    if(Object.values(this.clients).every(client => (client.ready))) {
      this.connector.broadcastToClients('startGame');

      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }



  //Getters/setters
  get phase() {
    return this._phase
  }

  set phase(phase) {
    if(phase !== this._phase) {
      const oldPhase = this._phase;

      this._phase = phase;

      this.connector.broadcastToClients('onPhaseChanged', {newPhase: phase, oldPhase});
    }
  }

  //public methods
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

  getCachedEntities(...cachePath) {
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
  }

  //Internal helper methods
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
