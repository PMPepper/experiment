import {combineReducers} from 'redux';
//import * as reducers from './coloniesWindow';

const reduxId = 'coloniesWindow';

import isOpen from '@/redux/HORs/isOpen';
import position from '@/redux/HORs/position';
import size from '@/redux/HORs/size';
//import tree, * as treeActions from '@/redux/HORs/tree';
import datatable from '@/redux/HORs/datatable';
import assignValueFactory, {assignValue} from '@/redux/HORs/assignValue';

const {reducer: mineralsTableReducer, ...mineralsTableActions} = datatable(`${reduxId}.mineralsTable`);
const {reducer: shipyardsTableReducer, ...shipyardsTableActions} = datatable(`${reduxId}.shipyardsTable`);

export default combineReducers({
  //...reducers,
  isOpen: isOpen(reduxId),
  position: position(reduxId),
  size: size(reduxId),
  tab: assignValueFactory(`${reduxId}.tab`, 0),
  selectedColonyId: assignValueFactory(`${reduxId}.colony`, ''),

  //minerals
  mineralsTable: mineralsTableReducer,

  //Shipyards
  shipyardsTable: shipyardsTableReducer,
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
export {shipyardsTableActions as shipyardsTableActions};
