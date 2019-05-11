export const SET_SORT_COLUMN = 'datatable.setSortColumn';
export const SET_PAGE = 'datatable.setPage';
export const SET_ROW_EXPANDED = 'datatable.setRowExpanded';
export const SET_ROWS_EXPANDED = 'datatable.setRowsExpanded';
export const SET_ROW_SELECTED = 'datatable.setRowSelected';
export const SET_ROWS_SELECTED = 'datatable.setRowsSelected';
export const SET_ROW_DISABLED = 'datatable.setRowDisabled';
export const SET_ROWS_DISABLED = 'datatable.setRowsDisabled';
export const REST = 'datatable.reset';

import modify from '@/helpers/object/modify';
import map from '@/helpers/object/map';


const DEFAULT_STATE = {
  sortColumnName: null,
  sortColumnDesc: false,

  page: 1,

  expandedRows: {},
  selectedRows: {},
  disabledRows: {},
};

export default function(id) {
  const reducer = function(state = DEFAULT_STATE, action) {
    if(action.id === id) {
      switch(action.type) {
        case SET_SORT_COLUMN:
          return (state.sortColumnName !== action.columnName || state.sortColumnDesc !== action.desc) ?
            {
              ...state,
              sortColumnName: action.columnName,
              sortColumnDesc: action.desc
            }
            :
            state;
        case SET_PAGE:
          return state.page !== action.page ?
            {
              ...state,
              page: action.page
            }
            :
            state;
        case SET_ROW_EXPANDED:
          return modify(state, ['expandedRows', action.row], action.isExpanded);
        case SET_ROWS_EXPANDED:
          return {
            ...state,
            expandedRows: action.replace ? 
              {...action.rows}
              :
              {
                ...state.expandedRows,
                ...action.rows
              }
          };
        case SET_ROW_SELECTED:
          return modify(state, ['selectedRows', action.row], action.isSelected);
        case SET_ROWS_SELECTED:
          return  {
            ...state,
            selectedRows: action.replace ?
              {...action.rows}
              :
              {
                ...state.selectedRows,
                ...action.rows
              }
          };
        case SET_ROW_DISABLED:
          return modify(state, ['disabledRows', action.row], action.isDisabled);
        case SET_ROWS_DISABLED:
          return  {
            ...state,
            disabledRows: action.replace ?
              {...action.rows}
              :
              {
                ...state.disabledRows,
                ...action.rows
              }
          };
        case RESET:
          return DEFAULT_STATE;
      }
    }

    return state;
  }


  return {
    reducer,
    ...getActionCreators(id)
  }
}

export function getActionCreators(id) {
  return {
    setSortColumn: (columnName, desc) => (setSortColumn(id, columnName, desc)),
    setPage: (page) => (setPage(id, page)),
    setRowExpanded: (row, isExpanded) => (setRowExpanded(id, row, isExpanded)),
    setRowsExpanded: (rows, replace) => (setRowsExpanded(id, rows, replace)),
    setRowSelected: (row, isSelected) => (setRowSelected(id, row, isSelected)),
    setRowsSelected: (rows, replace) => (setRowsSelected(id, rows, replace)),
    setRowDisabled: (row, isDisabled) => (setRowDisabled(id, row, isDisabled)),
    setRowsDisabled: (rows, replace) => (setRowsDisabled(id, rows, replace)),
    reset: () => (reset(id)),
  }
}

export function setSortColumn(id, columnName, desc = false) {
  return {
    id,
    type: SET_SORT_COLUMN,
    columnName,
    desc: !!desc
  };
}

export function setPage(id, page) {
  return {
    id,
    type: SET_PAGE,
    page
  };
}

export function setRowExpanded(id, row, isExpanded) {
  return {
    id,
    type: SET_ROW_EXPANDED,
    row,
    isExpanded
  };
}

export function setRowsExpanded(id, rows, replace = false) {
  return {
    id,
    type: SET_ROWS_EXPANDED,
    rows: map(rows, val => (!!val)),
    replace
  };
}

export function setRowSelected(id, row, isSelected) {
  return {
    id,
    type: SET_ROW_SELECTED,
    row,
    isSelected
  };
}

export function setRowsSelected(id, rows, replace = false) {
  return {
    id,
    type: SET_ROWS_SELECTED,
    rows: map(rows, val => (!!val)),
    replace
  };
}

export function setRowDisabled(id, row, isDisabled) {
  return {
    id,
    type: SET_ROW_DISABLED,
    row,
    isDisabled
  };
}

export function setRowsDisabled(id, rows, replace = false) {
  return {
    id,
    type: SET_ROWS_DISABLED,
    rows: map(rows, val => (!!val)),
    replace
  };
}

export function reset(id) {
  return {
    id,
    type: RESET,
  };
}
