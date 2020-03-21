const DFEAULT_GAME_STATE = {};
export const SET_GAME_STATE = 'game/SET_GAME_STATE';
export const UPDATE_GAME_STATE = 'game/UPDATE_GAME_STATE';

//The reducer
export default function game(state = DFEAULT_GAME_STATE, {type, payload}) {
  if(type === UPDATE_GAME_STATE) {
    if(payload.gameSpeed !== state.gameSpeed || payload.desiredGameSpeed !== state.desiredGameSpeed || payload.isPaused !== state.isPaused) {
      return {
        gameSpeed: payload.gameSpeed,
        desiredGameSpeed: payload.desiredGameSpeed,
        isPaused: payload.isPaused,
        //research, technology, components?
      };
    }
  } else if(type === SET_GAME_STATE) {
    return {
      gameSpeed: payload.gameSpeed,
      desiredGameSpeed: payload.desiredGameSpeed,
      isPaused: payload.isPaused,
      //research, technology, components?
    };
  }

  return state;
}


//Action creators
export function setGameState(newGameState, gameConfig) {
  return {
    type: SET_GAME_STATE,
    payload: {
      ...newGameState,
      gameConfig
    }
  };
}

export function updateGameState(newGameState, existingEntities) {
  return {
    type: UPDATE_GAME_STATE,
    payload: {
      ...newGameState,

      existingEntities
    }
  };
}
