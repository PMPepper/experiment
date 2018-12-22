import React from 'react';
import memoize from 'memoize-one';


import DataTable from './DataTable';
import combineSortFunctions from '@/helpers/combine-sort-functions';


export default class LocalStateDataTable extends React.Component {

  filter = memoize(
    (rows, columns, sortColumnName, sortColumnAsc, itemsPerPage = 25, page = 0, defaultSortColumn = null) => {
      const column = getColumnByName(columns, sortColumnName);
      const columnSortFunc = column ? column.sort : null;
      const defaultSortColumnObj = getColumnByName(columns, defaultSortColumn);
      let filteredRows = Object.values(rows);

      //Sorting
      const sortFunc = defaultSortColumn && defaultSortColumn !== sortColumnName && defaultSortColumnObj ?
        combineSortFunctions(columnSortFunc,  defaultSortColumnObj.sort)
        :
        columnSortFunc;

      sortFunc && filteredRows.sort(sortFunc);

      //pagination
      if(itemsPerPage > 0) {
        return filteredRows.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      }

      return filteredRows;
    }
  );

  render() {
    const props = this.props;

    return <DataTable
      {...props}
      rows={this.filter(
        props.rows,
        props.columns,
        props.sortColumnName,
        props.sortColumnAsc,
        props.itemsPerPage,
        props.page,
        props.defaultSortColumn
      )}
    />
  }
}

function getColumnByName(columns, name) {
  return columns.find(column => (column.name === name)) || null;
}
