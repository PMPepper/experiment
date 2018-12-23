import React from 'react';
import PropTypes from 'prop-types';
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
  getRows = memoize((rows) => (Object.values(rows)))

  getSortRowsFunc = memoize(
    (columns, sortColumnName, sortColumnDesc, defaultSortColumns = null) => {
      defaultSortColumns = defaultSortColumns || [];

      const sortFuncs = [
        getColumnSortFunc(getColumnByName(columns, sortColumnName), sortColumnDesc),
        ...defaultSortColumns.map(defaultSortColumn => {
          let defaultSortColumnName, defaultSortColumnDesc = false;

          if(defaultSortColumn instanceof Array) {
            defaultSortColumnName = defaultSortColumn[0];
            defaultSortColumnDesc = defaultSortColumn[1];
          } else {
            defaultSortColumnName = defaultSortColumn;
          }

          return defaultSortColumnName !== sortColumnName ? getColumnSortFunc(getColumnByName(columns, defaultSortColumnName), defaultSortColumnDesc): null;
        })
      ];

      return combineSortFunctions.apply(null, sortFuncs);
    }
  );

  sortRows = memoize(
    (rows, sortRowsFunc) => {
      if(sortRowsFunc) {
        //need to duplication rows so that memoize detects that something has changed
        rows = [...rows];
        rows.sort(sortRowsFunc);
        return rows;
      }

      return rows;
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
          this.getRows(props.rows),
          this.getSortRowsFunc(
            props.columns,
            props.sortColumnName,
            props.sortColumnDesc,
            props.defaultSortColumns
          )
        ),
        props.itemsPerPage,
        props.page
      )}
    />
  }

  static propTypes = {
    defaultSortColumns: PropTypes.array,//TODO full shape (string, or array)
  };
}


//Internal helpers
function getColumnByName(columns, name) {
  return columns.find(column => (column.name === name)) || null;
}

function getColumnSortFunc(column, desc = false) {
  if(!column || !column.sort) {//if this column is not sortable, do nothing
    return null;
  }

  if(column.sort instanceof Function) {
    //column has a custom sort function
    return column.sort(desc);
  }

  const metaType = metaTypes[column.valueType || 'string'];

  if(metaType) {
    return metaType.getSortFunc(column, desc);
  }

  return null;
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
    console.log('column', desc);
    const columnName = column.name;

    return desc ?
      (a, b) => {
        a = a.data[columnName];
        b = b.data[columnName];

        return (a > b) ? -1 : ((a < b) ? 1 : 0)
      }
      :
      (a, b) => {
        a = a.data[columnName];
        b = b.data[columnName];

        return (a < b) ? -1 : ((a > b) ? 1 : 0)
      }
  },
  (value, column, row, props) => (value)
);

registerDatatableMetatype(
  'number',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (b.data[columnName] - a.data[columnName])
      :
      (a, b) => (a.data[columnName] - b.data[columnName])
  },
  (value, column, row, props) => (<FormatNumber value={value} langCode={props.langCode} />)
);

registerDatatableMetatype(
  'date',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (b.data[columnName] - a.data[columnName])
      :
      (a, b) => (a.data[columnName] - b.data[columnName])
  },
  (value, column, row, props) => (<Time value={value} langCode={props.langCode} format="date" />)
);

registerDatatableMetatype(
  'datetime',
  (column, desc) => {
    const columnName = column.name;

    return desc ?
      (a, b) => (b.data[columnName] - a.data[columnName])
      :
      (a, b) => (a.data[columnName] - b.data[columnName])
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
