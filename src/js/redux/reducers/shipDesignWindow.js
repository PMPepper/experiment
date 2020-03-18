import {combineReducers} from 'redux';

const reduxId = 'shipDesignWindow';

import isOpen from '@/redux/HORs/isOpen';
import position from '@/redux/HORs/position';
import size from '@/redux/HORs/size';

export default combineReducers({
  //...reducers,
  isOpen: isOpen(reduxId),
  position: position(reduxId),
  size: size(reduxId)
});
