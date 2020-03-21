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
    const linkType = linkedTypes[entity.type];

    if(linkType) {
      if(entity.factionId != payload.factionId) {
        continue;
      }

      const linkedEntityId = entity[linkType.foreignKey];
      const linkedEntity = payload.entities[linkedEntityId];

      newState[linkedEntityId] = resolvePath(entity, linkType.path);
    }
  }

  return newState;
}

function updateState(state, payload) {
  const newState = {...state};
  let hasChanged = false;

  for(let i = 0; i < payload.removedEntities.length; ++i) {
    const id = payload.removedEntities[i];

    if(newState[id]) {
      hasChanged = true;
      delete newState[id];
    }
  }

  //added/edited entities
  for(var id in payload.entities) {
    const entity = payload.entities[id];
    const linkType = linkedTypes[entity.type];

    if(linkType) {
      if(entity.factionId != payload.factionId) {
        continue;
      }

      const linkedEntityId = entity[linkType.foreignKey];
      const linkedEntity = payload.entities[linkedEntityId];
      const name = resolvePath(entity, linkType.path);

      if(newState[linkedEntityId] !== name) {
        hasChanged = true;
        newState[linkedEntityId] = name
      }
    }
  }

  return hasChanged ? newState : state;
}
