//import Immutable from 'seamless-immutable';

import MapSet from '@/classes/MapSet';

import remove from '@/helpers/array/remove';
import reduce from '@/helpers/object/reduce';

// Examples
// const state = {
//   byId: {},
//   allIds: [],
//
//   //foreign keys, e.g.
//   by: {
//     podId: {}
//   }
// }

// const schema: {
//   name: '',
//   primaryKey: 'id',
//   foreignKeys: ['podId']
// }


export function makeSchema(name, primaryKey = 'id', foreignKeys = []) {
  return {
    name,
    primaryKey,
    foreignKeys
  };
}

export function makeDefaultState(schema) {
  return {
    byId: {},
    allIds: [],
    by: schema.foreignKeys.reduce((by, foreignKey) => {
      by[foreignKey] = {};

      return by;
    }, {})
  };
}

export function clear(schema) {
  return makeDefaultState(schema);
}

export function removeByKey(state, schema, key, value) {
  if(!schema) {
    throw new Error(`a valid schema is required`);
  }

  if(!key) {
    throw new Error(`a valid key is required`);
  }

  //Find the key(s) to remove
  let idsToRemove = null;

  if(key === primaryKey) {
    idsToRemove = new Set([`${value}`]);
  } else {
    if(!schema.foreignKeys.includes(key)) {
      throw new Error(`Unknown key "${key}" not present in schema "${schema.name}"`);
    }

    idsToRemove = new Set(state.by[key][value]);
  }

  return removeByIds(state, schema, idsToRemove)
}

export function removeByIds(state, schema, ids) {

  if(!schema) {
    throw new Error(`a valid schema is required`);
  }

  if(!(ids instanceof Set)) {
    ids = ((ids instanceof Array) ? ids : Array.from(ids)).map(value => value ? value.toString() : '');
    ids = new Set(ids);
  }

  if(ids.size === 0) {
    return state;
  }

  let hasRemovedItem = false;

  //Build the new state
  const newState = makeDefaultState(schema);

  for(let id in state.byId) {
    const item = state.byId[id];

    if(ids.has(id)) {
      hasRemovedItem = true;

      continue;
    }

    newState.byId[id] = item;
    newState.allIds.push(id);

    schema.foreignKeys.forEach(foreignKeyName => {
      if(!foreignKeyName in item) {
        return;
      }

      const foreignKey = item[foreignKeyName];

      if(!newState.by[foreignKey]) {
        newState.by[foreignKey] = [];
      }

      newState.by[foreignKey].push(id);
    });
  }

  return hasRemovedItem ?
    newState
    :
    state;
}

//will create the state with the supplied data
export function set(data, schema) {
  const newState = makeDefaultState(schema);

  normalise(data, schema).forEach(item => {
    const key = item[schema.primaryKey];

    newState.byId[key] = item;
    newState.allIds.push(key);

    schema.foreignKeys.forEach(foreignKeyName => {
      const foreignKey = item[foreignKeyName];

      if(!foreignKey) {
        return;
      }

      if(!newState.by[foreignKeyName][foreignKey]) {
        newState.by[foreignKeyName][foreignKey] = [];
      }

      newState.by[foreignKeyName][foreignKey].push(key);
    });
  });

  return newState;
}

//will add the supplied data to the current state
export function merge(state, data, schema) {
  const newState = {
    byId: {...state.byId},
    by: {}
  };

  const allIds = new Set(state.allIds);

  const currentForeignKeyIds = schema.foreignKeys.reduce((currentForeignKeyIds, foreignKeyName) => {
    currentForeignKeyIds[foreignKeyName] = new MapSet(state.by[foreignKeyName]);

    return currentForeignKeyIds;
  }, {})

  normalise(data, schema).forEach(item => {
    const id = item[schema.primaryKey];

    newState.byId[id] = item;

    allIds.add(id);

    schema.foreignKeys.forEach(foreignKeyName => {
      if(item[foreignKeyName] === null) {
        return;
      }

      const foreignKey = item[foreignKeyName];

      currentForeignKeyIds[foreignKeyName].set(foreignKey, item[schema.primaryKey]);
    });
  });

  newState.allIds = Array.from(allIds);

  schema.foreignKeys.forEach(foreignKeyName => {
    newState.by[foreignKeyName] = currentForeignKeyIds[foreignKeyName].toObject();
  })

  return newState;
}

export function normalise(data, schema) {
  data = (data instanceof Array) ? data : Object.values(data);

  return data.map(item => {
    const normalisedItem = {...item};

    normalisedItem[schema.primaryKey] = `${normalisedItem[schema.primaryKey]}`;

    schema.foreignKeys.forEach(foreignKeyName => {
      const value = normalisedItem[foreignKeyName];

      normalisedItem[foreignKeyName] = value === null || value === undefined ?
        null
        :
        `${value}`
    })

    return normalisedItem;
  })
}
