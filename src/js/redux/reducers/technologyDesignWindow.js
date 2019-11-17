import {combineReducers} from 'redux';

const reduxId = 'technologyDesignWindow';

import isOpen, {OPEN} from '@/redux/HORs/isOpen';
import position, {MOVE_TO, MOVE_BY} from '@/redux/HORs/position';
import size, {RESIZE_TO, RESIZE_BY} from '@/redux/HORs/size';
import lastInteracted from '@/redux/HORs/lastInteracted';

export default combineReducers({
  //...reducers,
  isOpen: isOpen(reduxId),
  position: position(reduxId),
  size: size(reduxId),
  lastInteracted: lastInteracted(reduxId, [OPEN, MOVE_TO, MOVE_BY, RESIZE_TO, RESIZE_BY])
});
