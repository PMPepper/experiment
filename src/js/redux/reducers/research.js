import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';


export default function reducer(state = {}, {type, payload}) {
  if(type === SET_GAME_STATE) {
    return payload.gameConfig.research
  } else if(type === UPDATE_GAME_STATE) {
    if(payload.research) {
      return {//merge new research projects in to research list
        ...state,
        ...payload.research
      }
    }
  }

  return state
}
