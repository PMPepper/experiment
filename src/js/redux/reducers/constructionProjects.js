import {SET_GAME_STATE} from '@/redux/reducers/game';


export default function reducer(state = {}, {type, payload}) {
  if(type === SET_GAME_STATE) {
    return payload.gameConfig.constructionProjects
  }

  return state
}
