import React, {useReducer, useCallback, useMemo} from 'react';


import modify from '@/helpers/object/modify';

//Reducer stuff
const initialState = {
  sortColumnName: null,
  sortColumnDesc: false,
  page: 1,
  expandedRows: null,
  selectedRows: null,
  disabledRows: null
};

function reducer(state, action) {
  console.log(action);
  switch(action.type) {
    case 'setSortColumn':
      return {
        ...state,
        sortColumnName: action.columnName,
        sortColumnDesc: action.desc
      };
    case 'setPage':
      return {
        ...state,
        page: action.page
      };
    case 'setRowExpanded':
      return modify(state, ['expandedRows', action.id], action.isExpanded);
    case 'setRowsExpanded':
      return modify(state, ['expandedRows'], {...state.expandedRows, ...action.expandedRows});
    case 'setRowSelected':
      return modify(state, ['selectedRows', action.id], action.isSelected);
    case 'setRowsSelected':
      return modify(state, ['selectedRows'], {...state.selectedRows, ...action.selectedRows});
    case 'setRowDisabled':
      return modify(state, ['disabledRows', action.id], action.isDisabled);
    case 'setRowsDisabled':
      return modify(state, ['disabledRows'], {...state.disabledRows, ...action.disabledRows});

  }

  return state;
}


export default function LocalTableState({
  rows, children, initialPage,
  initialExpandedRows, initialSelectedRows, initialDisabledRows,
  expandedRows, selectedRows, disabledRows,
  setRowExpanded, setRowsExpanded, setRowSelected, setRowsSelected, setRowDisabled, setRowsDisabled,
  ...rest
}) {
  const [{
    sortColumnName,
    sortColumnDesc,
    page,
    expandedRows: stateExpandedRows,
    selectedRows: stateSelectedRows,
    disabledRows: stateDisabledRows
  }, dispatch] = useReducer(reducer, initialState, initialState => ({
    //initialise the state
    ...initialState,

    page: initialPage || 1,

    expandedRows: initialExpandedRows ? {...initialExpandedRows} : {},
    selectedRows: initialSelectedRows ? {...initialSelectedRows} : {},
    disabledRows: initialDisabledRows ? {...initialDisabledRows} : {},
  }));

  const child = React.Children.only(children);

  const setSortColumn = useCallback((columnName, desc = false) => {
    dispatch({type: 'setSortColumn', columnName, desc});
  }, []);

  const setPage = useCallback((page) => {
    dispatch({type: 'setPage', page});
  }, []);

  const stateSetRowExpanded = useCallback((id, isExpanded) => {
    dispatch({type: 'setRowExpanded', id, isExpanded});
  }, []);

  const stateSetRowsExpanded = useCallback((expandedRows) => {
    dispatch({type: 'setRowsExpanded', expandedRows});
  }, []);

  const stateSetRowSelected = useCallback((id, isSelected) => {
    dispatch({type: 'setRowSelected', id, isSelected});
  }, []);

  const stateSetRowsSelected = useCallback((selectedRows) => {
    dispatch({type: 'setRowsSelected', selectedRows});
  }, []);

  const stateSetRowDisabled = useCallback((id, isDisabled) => {
    dispatch({type: 'setRowDisabled', id, isDisabled});
  }, []);

  const stateSetRowsDisabled = useCallback((disabledRows) => {
    dispatch({type: 'setRowsDisabled', disabledRows});
  }, []);

  return React.cloneElement(
    child,
    {
      rows,
      ...rest,//other props

      sortColumnName,
      sortColumnDesc,
      page,

      expandedRows: expandedRows || stateExpandedRows,
      selectedRows: selectedRows || stateSelectedRows,
      disabledRows: disabledRows || stateDisabledRows,

      //handlers
      setSortColumn,
      setPage,
      setRowExpanded: setRowExpanded || stateSetRowExpanded,
      setRowsExpanded: setRowsExpanded || stateSetRowsExpanded,
      setRowSelected: setRowSelected || stateSetRowSelected,
      setRowsSelected: setRowsSelected || stateSetRowsSelected,
      setRowDisabled: setRowDisabled || stateSetRowDisabled,
      setRowsDisabled: setRowsDisabled || stateSetRowsDisabled
    }
  );
}
