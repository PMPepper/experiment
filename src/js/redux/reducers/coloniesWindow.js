import {combineReducers} from 'redux';
//import * as reducers from './coloniesWindow';

const reduxId = 'coloniesWindow';

import isOpen, {OPEN} from '@/redux/HORs/isOpen';
import position, {MOVE_TO, MOVE_BY} from '@/redux/HORs/position';
import size, {RESIZE_TO, RESIZE_BY} from '@/redux/HORs/size';
//import tree, * as treeActions from '@/redux/HORs/tree';
import datatable from '@/redux/HORs/datatable';
import lastInteracted from '@/redux/HORs/lastInteracted';
import assignValueFactory, {assignValue} from '@/redux/HORs/assignValue';

const {reducer: mineralsTableReducer, ...mineralsTableActions} = datatable(`${reduxId}.mineralsTable`);
const {reducer: availableResearchTableReducer, ...availableResearchTableActions} = datatable(`${reduxId}.availableResearchTable`);

export default combineReducers({
  //...reducers,
  isOpen: isOpen(reduxId),
  position: position(reduxId),
  size: size(reduxId),
  lastInteracted: lastInteracted(reduxId, [OPEN, MOVE_TO, MOVE_BY, RESIZE_TO, RESIZE_BY]),
  tab: assignValueFactory(`${reduxId}.tab`, 0),
  selectedColonyId: assignValueFactory(`${reduxId}.colony`, ''),

  //minerals
  mineralsTable: mineralsTableReducer,

  //research
  researchSelectedArea: assignValueFactory(`${reduxId}.research.selectedArea`, 0),
  availableResearchTable: availableResearchTableReducer,
});


export function setTab(tab) {
  return assignValue(`${reduxId}.tab`, tab);
}

export function setSelectedColonyId(colonyId) {
  return assignValue(`${reduxId}.colony`, +colonyId);
}

export function setResearchSelectedArea(selectedArea) {
  return assignValue(`${reduxId}.research.selectedArea`, selectedArea);
}

//TODO do I need this?
//minerals table
export {mineralsTableActions as mineralsTableActions};
