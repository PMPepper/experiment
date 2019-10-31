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
      return modify(state, ['selectedRows', action.id], action.isExpanded);
    case 'setRowsSelected':
      return modify(state, ['selectedRows'], {...state.selectedRows, ...action.selectedRows});
    case 'setRowDisabled':
      return modify(state, ['disabledRows', action.id], action.isExpanded);
    case 'setRowsDisabled':
      return modify(state, ['disabledRows'], {...state.disabledRows, ...action.disabledRows});

  }

  return state;
}


export default function LocalTableState({rows, children, initialPage, expandedRows, selectedRows, disabledRows, ...rest}) {
  const [state, dispatch] = useReducer(reducer, initialState, initialState => ({
    //initialise the state
    ...initialState,

    page: initialPage || 1,

    expandedRows: expandedRows ? {...expandedRows} : {},
    selectedRows: selectedRows ? {...selectedRows} : {},
    disabledRows: disabledRows ? {...disabledRows} : {},
  }));

  const child = React.Children.only(children);

  const setSortColumn = useCallback((columnName, desc = false) => {
    dispatch({type: 'setSortColumn', columnName, desc});
  }, []);

  const setPage = useCallback((page) => {
    dispatch({type: 'setPage', page});
  }, []);

  const setRowExpanded = useCallback((id, isExpanded) => {
    dispatch({type: 'setRowExpanded', is, isExpanded});
  }, []);

  const setRowsExpanded = useCallback((expandedRows) => {
    dispatch({type: 'setRowsExpanded', expandedRows});
  }, []);

  const setRowSelected = useCallback((id, isSelected) => {
    dispatch({type: 'setRowSelected', id, isSelected});
  }, []);

  const setRowsSelected = useCallback((selectedRows) => {
    dispatch({type: 'setRowsSelected', selectedRows});
  }, []);

  const setRowDisabled = useCallback((id, isDisabled) => {
    dispatch({type: 'setRowDisabled', id, isDisabled});
  }, []);

  const setRowsDisabled = useCallback((disabledRows) => {
    dispatch({type: 'setRowsDisabled', disabledRows});
  }, []);

  return React.cloneElement(
    child,
    {
      rows,
      ...rest,//other props
      ...state,///table state props
      //handlers
      setSortColumn, setPage, setRowExpanded, setRowsExpanded, setRowSelected,
      setRowsSelected, setRowDisabled, setRowsDisabled
    }
  );
}
