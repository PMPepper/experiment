import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';

//Internal
import DataTablePresentational from './DataTablePresentational';

//Components
import FormatNumber from '@/components/formatNumber/FormatNumber';
import Time from '@/components/time/Time';

//Helpers
import combineSortFunctions from '@/helpers/combine-sort-functions';
import objectResolvePath from '@/helpers/object-resolve-path';


export default class DataTable extends React.Component {

  sortRows = memoize(
    (rows, columns, sortColumnName, sortColumnAsc, defaultSortColumn = null) => {
      //TODO this is pretty much totally wrong - take into account meta types & custom sort functions
      const column = getColumnByName(columns, sortColumnName);
      const columnSortFunc = column ? column.sort : null;
      const defaultSortColumnObj = getColumnByName(columns, defaultSortColumn);
      let sortedRows = Object.values(rows);
/*
      //Get the sorting function
      const sortFunc = defaultSortColumn && defaultSortColumn !== sortColumnName && defaultSortColumnObj ?
        combineSortFunctions(columnSortFunc,  defaultSortColumnObj.sort)
        :
        columnSortFunc;
*/
      //If there is a sorting function, apply it
      //sortFunc && sortedRows.sort(sortFunc);

      return sortedRows;
    }
  );

  paginateRows = memoize((sortedRows, itemsPerPage = 25, page = 0) => {
    if(itemsPerPage > 0) {
      return sortedRows.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    }

    return sortedRows;
  })

  render() {
    const props = this.props;

    return <DataTablePresentational
      {...props}
      rows={this.paginateRows(
        this.sortRows(
          props.rows,
          props.columns,
          props.sortColumnName,
          props.sortColumnAsc,
          props.defaultSortColumn
        ),
        props.itemsPerPage,
        props.page
      )}
    />
  }
}


//Internal helpers
function getColumnByName(columns, name) {
  return columns.find(column => (column.name === name)) || null;
}


//Metatypes
function registerDatatableMetatype(name, getSortFunc, formatFunc = null, dataCellClass = null, headCellClass = null) {
  metaTypes[name] = {
    name,
    formatFunc,
    getSortFunc,
    dataCellClass,
    headCellClass,
  };
}

const metaTypes = {};

export function getMetaTypes() {
  return {...metaTypes};
}

//string is the default column type
registerDatatableMetatype(
  'string',
  (column, desc) => {
    return desc ?
      (a, b) => {
        a = a.data[column];
        b = b.data[column];

        return (a < b) ? -1 : ((a > b) ? 1 : 0)
      }
      :
      (a, b) => {
        a = a.data[column];
        b = b.data[column];

        return (a > b) ? -1 : ((a < b) ? 1 : 0)
      }
  },
  (value, column, row, props) => (value)
);

registerDatatableMetatype(
  'number',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (a.data[columnName] - b.data[columnName])
      :
      (a, b) => (b.data[columnName] - a.data[columnName])
  },
  (value, column, row, props) => (<FormatNumber value={value} langCode={props.langCode} />)
);

registerDatatableMetatype(
  'date',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (a.data[columnName] - b.data[columnName])
      :
      (a, b) => (b.data[columnName] - a.data[columnName])
  },
  (value, column, row, props) => (<Time value={value} langCode={props.langCode} format="date" />)
);

registerDatatableMetatype(
  'datetime',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (a.data[columnName] - b.data[columnName])
      :
      (a, b) => (b.data[columnName] - a.data[columnName])
  },
  (value, column, row, props) => (<Time value={value} langCode={props.langCode} format="datetime" />)
);

registerDatatableMetatype(
  'mapped',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (a.data[columnName] - b.data[columnName])
      :
      (a, b) => (b.data[columnName] - a.data[columnName])
  },
  (value, column, row, props) => {
    const mappedTo = objectResolvePath(props, column.mappedTo)
    const mappedValueType = metaTypes[column.mappedValueType || 'string'];

    return mappedValueType.formatFunc(mappedTo[value], column, row, props);
  }
);
