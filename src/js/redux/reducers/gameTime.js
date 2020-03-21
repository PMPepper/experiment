import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';



export default function reducer(state = 0, {type, payload}) {
  if(type === UPDATE_GAME_STATE || type === SET_GAME_STATE) {
    return payload.gameTime;
  }

  return state;
}
