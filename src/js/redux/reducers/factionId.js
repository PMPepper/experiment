import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';


export default function reducer(state = {}, {type, payload}) {
  if(type === UPDATE_GAME_STATE) {
    return payload.factionId
  } else if(type === SET_GAME_STATE) {
    return payload.factionId
  }

  return state;
}
