import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';



export default function reducer(state = 0, action) {
  if(action.type === UPDATE_GAME_STATE || action.type === SET_GAME_STATE) {
    return action.payload.gameTime;
  }

  return state;
}
