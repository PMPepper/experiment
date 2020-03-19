import ClientState from '@/game/ClientState';

//import deepFreeze from '@/helpers/object/deep-freeze';

const DFEAULT_GAME_STATE = {};
export const SET_GAME_STATE = 'game/SET_GAME_STATE';
export const UPDATE_GAME_STATE = 'game/UPDATE_GAME_STATE';

//The reducer
export default function game(state = DFEAULT_GAME_STATE, action) {
  if(action.type === UPDATE_GAME_STATE) {
    return ClientState.mergeState(state, action.data);
  } else if(action.type === SET_GAME_STATE) {
    return action.data;
  }

  return state;
}


//Action creators
export function setGameState(newGameState, gameConfig) {
  return {
    type: SET_GAME_STATE,
    data: ClientState.fromState(newGameState, gameConfig),//deprecated
    payload: newGameState
  };
}

export function updateGameState(newGameState, existingEntities) {
  return {
    type: UPDATE_GAME_STATE,
    data: newGameState,//deprecated
    payload: {
      entities: Object.freeze(newGameState.entities),
      removedEntities: newGameState.removedEntities,
      factionId: newGameState.factionId,
      existingEntities
    }
  };
}
