import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';


export default function reducer(state = {}, {type, payload}) {
  if(type === SET_GAME_STATE) {
    return payload.gameConfig.components
  } else if(type === UPDATE_GAME_STATE) {
    if(payload.components) {
      return {//merge new components in to list
        ...state,
        ...payload.components
      }
    }
  }

  return state
}
