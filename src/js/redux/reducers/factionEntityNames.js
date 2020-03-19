import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';

//Helpers
import resolvePath from '@/helpers/object/resolve-path';

const linkedTypes = {
  factionSystem: {
    foreignKey: 'systemId',
    path: ['factionSystem', 'name']
  },
  factionSystemBody: {
    foreignKey: 'systemBodyId',
    path: ['factionSystemBody', 'name']
  }
};

export default function reducer(state = {}, action) {
  if(action.type === UPDATE_GAME_STATE) {
    return updateState(state, action);
  } else if(action.type === SET_GAME_STATE) {
    return setState(state, action)
  }

  return state;
}

function setState(state, action) {
  const newState = {};

  for(var id in action.payload.entities) {
    const entity = action.payload.entities[id];
    const linkType = linkedTypes[entity.type];

    if(linkType) {
      if(entity.factionId != action.payload.factionId) {
        continue;
      }

      const linkedEntityId = entity[linkType.foreignKey];
      const linkedEntity = action.payload.entities[linkedEntityId];

      newState[linkedEntityId] = resolvePath(entity, linkType.path);
    }
  }

  return newState;
}

function updateState(state, action) {
  const newState = {...state};
  let hasChanged = false;

  for(let i = 0; i < action.payload.removedEntities.length; ++i) {
    const id = action.payload.removedEntities[i];

    if(newState[id]) {
      hasChanged = true;
      delete newState[id];
    }
  }

  //added/edited entities
  for(var id in action.payload.entities) {
    const entity = action.payload.entities[id];
    const linkType = linkedTypes[entity.type];

    if(linkType) {
      if(entity.factionId != action.payload.factionId) {
        continue;
      }

      const linkedEntityId = entity[linkType.foreignKey];
      const linkedEntity = action.payload.entities[linkedEntityId];
      const name = resolvePath(entity, linkType.path);

      if(newState[linkedEntityId] !== name) {
        hasChanged = true;
        newState[linkedEntityId] = name
      }
    }
  }

  return hasChanged ? newState : state;
}
