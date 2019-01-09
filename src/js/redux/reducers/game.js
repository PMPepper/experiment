import ClientState from '@/game/ClientState';

const DFEAULT_GAME_STATE = {};
const SET_GAME_STATE = 'game/SET_GAME_STATE';
const UPDATE_GAME_STATE = 'game/UPDATE_GAME_STATE';

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
export function setGameState(newGameState) {
  return {
    type: SET_GAME_STATE,
    data: ClientState.fromState(newGameState)
  };
}

export function updateGameState(newGameState) {
  return {
    type: UPDATE_GAME_STATE,
    data: newGameState
  };
}
