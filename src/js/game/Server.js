import resolvePath from '@/helpers/object/resolve-path';

import * as entityCacheTypes from './entityCacheTypes';


//The actual game object

const players = {};
const factions = {};
const clients = {};
const entities = {};
const entityCache = {};

let entityId = 1;
let entityCacheDirty = false;
let entityIds = null;

export function getEntityById(id) {
  return entities[id];
}

export function getEntitiesByIds(ids) {
  return ids.map(id => (entities[id]));
}

export function newEntity(type, props) {
  const newEntity = {
    ...props,
    id: entityId++,
    type,
  };

  entities[newEntity.id] = newEntity;
  entityCacheDirty = true;

  return newEntity;
}



export function removeEntity(entity) {
  if(typeof(entity) === 'object') {
    entity = entity.id;
  }

  entityCacheDirty = true;

  delete entities[entity];
}

export function getCachedEntities(...cachePath) {
  const entityCacheTypeName = cachePath[0];

  if(entityCacheDirty) {
    //clear entity cache
    for(let i = 0, k = Object.keys(entityCache), l = k.length; i < l; ++i) {
      delete entityCache[k[i]];
    }

    //rebuild and cache ids list
    entityIds = Object.keys(entities);

    entityCacheDirty = false;
  }

  //Only create caches when you need them
  if(!entityCache.hasOwnProperty(entityCacheTypeName)) {
    //rebuild this cache
    entityCache[entityCacheTypeName] = entityCacheTypes[entityCacheTypeName](entities, entityIds);
  }

  //get the requested data
  return resolvePath(entityCache, cachePath);
}


/////////
// DEV //
/////////
export function debug() {
  console.log(entities);
}
