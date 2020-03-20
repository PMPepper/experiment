import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';


export default function reducer(state = {}, action) {
  if(action.type === UPDATE_GAME_STATE) {
    return action.payload.factionId
  } else if(action.type === SET_GAME_STATE) {
    return action.payload.factionId
  }

  return state;
}
