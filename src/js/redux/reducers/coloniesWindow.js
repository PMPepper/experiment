import {combineReducers} from 'redux';
//import * as reducers from './coloniesWindow';

const reduxId = 'coloniesWindow';

import isOpen, {OPEN} from '@/redux/HORs/isOpen';
import position, {MOVE_TO, MOVE_BY} from '@/redux/HORs/position';
import size, {RESIZE_TO, RESIZE_BY} from '@/redux/HORs/size';
import tree, * as treeActions from '@/redux/HORs/tree';
import lastInteracted from '@/redux/HORs/lastInteracted';
import assignValueFactory, {assignValue} from '@/redux/HORs/assignValue';

export default combineReducers({
  //...reducers,
  isOpen: isOpen(reduxId),
  position: position(reduxId),
  size: size(reduxId),
  lastInteracted: lastInteracted(reduxId, [OPEN, MOVE_TO, MOVE_BY, RESIZE_TO, RESIZE_BY]),
  tab: assignValueFactory(reduxId, 0),
  tree: tree(reduxId)
});


export function setTab(tab) {
  return assignValue(reduxId, tab);
}

export function setIsNodeOpen(node, isOpen) {
  return treeActions.setIsNodeOpen(reduxId, node, isOpen);
}

export function setNodeSelected(node) {
  return treeActions.setNodeSelected(reduxId, node);
}
