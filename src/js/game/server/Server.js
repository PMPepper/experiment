import resolvePath from '@/helpers/object/resolve-path';

import createWorldFromDefinition from './createWorldFromDefinition';
import * as entityCacheTypes from './entityCacheTypes';

//Server phases
const INITIALISING = 'initialising';
const CONNECTING = 'connecting';


export default class Server {
  phase = INITIALISING;

  players = {};//represents people (or AI I guess...)
  factions = {};//e.g. The in-game factions Humans, martians
  factionPlayers = {};//links factions to players - defines their permissions (e.g. owner, spectator)
  clients = {};//a client is a player connected to a faction by a connection method with a permissions e.g. Bob spectating Martians on ip 1.2.3.4

  entities = {};
  entityCache = {};

  entityId = 1;
  entityCacheDirty = false;
  entityIds = null;

  //have recieved message from client
  onMessage(type, data) {
    if(this[type]) {
      return this[type](data);
    }

    console.log('Unknown message from client: ', type, data);
  }

  createWorld(definition) {
    if(this.phase !== INITIALISING) {
      throw new Error('Can only create world while Server is in "initialising" phase');
    }

    //TODO initialise the world based on supplied definition
    createWorldFromDefinition(this, definition);

    //Now waiting for players to connect
    this.phase = CONNECTING;

    //TODO what to send back to the client?
    return Promise.resolve();
  }

  connectPlayer({playerName}) {
    if(this.phase !== CONNECTING) {
      throw new Error('Can only connect player while Server is in "connecting" phase');
    }

    //TODO check that connecting player is in world definition - if they aren't then throw error

    //TODO mark player as connected

    //TODO if all players connected, update server state and tell clients that the game is starting

    return Promise.resolve();
  }


  getEntityById(id) {
    return this.entities[id];
  }

  getEntitiesByIds(ids) {
    const entities = this.entities;

    return ids.map(id => (entities[id]));
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
}
