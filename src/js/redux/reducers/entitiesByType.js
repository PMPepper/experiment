import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';

import isEmpty from '@/helpers/object/is-empty';



export default function reducer(state = {}, {type, payload}) {
  if(type === UPDATE_GAME_STATE) {
    return updateState(state, payload);
  } else if(type === SET_GAME_STATE) {
    return setState(state, payload)
  }

  return state;
}

function setState(state, payload) {
  const newState = {};

  for(var id in payload.entities) {
    const entity = payload.entities[id];

    if(!newState[entity.type]) {
      newState[entity.type] = {};
    }

    newState[entity.type][entity.id] = entity;
  }

  return newState;
}

function updateState(state, payload) {
  const updatedTypes = {};
  const updatedState = {};

  for(let i = 0; i < payload.removedEntities.length; ++i) {
    const id = payload.removedEntities[i];
    const entity = payload.existingEntities.byId[id];

    if(!updatedTypes[entity.type]) {//if this entity type has not yet been changed...
      updatedTypes[entity.type] = true;//...record that it is being changed...
      updatedState[entity.type] = {...state[entity.type]}//...and clone the current set of entities of that type
    }

    delete updatedState[entity.type][entity.id];//remove the deleted entity from the set
  }

  for(var id in payload.entities) {
    const entity = payload.entities[id];

    if(!updatedTypes[entity.type]) {//if this entity type has not yet been changed...
      updatedTypes[entity.type] = true;//...record that it is being changed...
      updatedState[entity.type] = {...state[entity.type]}//...and clone the current set of entities of that type
    }

    updatedState[entity.type][entity.id] = entity;//add/replace entity into the set
  }

  if(isEmpty(updatedTypes)) {
    return state;//nothing was changed
  }

  //merge in any unchanged types
  for(let type in state) {
    if(!updatedTypes[type]) {
      updatedState[type] = state[type];
    }
  }

  return updatedState;
}
