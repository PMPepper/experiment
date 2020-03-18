import shallowCompare from '@/helpers/array/shallow-compare';

import {INTERACT} from '@/redux/HORs/lastInteracted';
import {OPEN} from '@/redux/HORs/isOpen';
import {MOVE_TO, MOVE_BY} from '@/redux/HORs/position';
import {RESIZE_TO, RESIZE_BY} from '@/redux/HORs/size';

//Consts
const validInteractions = [INTERACT, OPEN, MOVE_TO, MOVE_BY, RESIZE_TO, RESIZE_BY];

//The reducer
export default function reducer(state = [], action) {
  if(action.id && validInteractions.includes(action.type)) {
    const lastIndex = state.indexOf(action.id);

    const newState = (lastIndex !== -1) ?
      [...state.slice(0, lastIndex), ...state.slice(lastIndex+1), action.id]
      :
      [...state, action.id];

    return shallowCompare(newState, state) ? state : newState;
  }

  return state;
}
