import React from 'react';
import {compose} from 'recompose';
import defaultStyles from './styles.scss';


import THead from './THead';
import TBody from './TBody';
import Row from './Row';
import TFoot from './TFoot';

import FormatNumber from '@/components/formatNumber/FormatNumber';
import Time from '@/components/time/Time';


function DataTable(props) {
  const {
    columns, rows,
    styles,
    sortColumnName, setSortColumnName, sortColumnAsc, setSortColumnAsc,
    tHeadComponent: THeadComponent,
    tBodyComponent: TBodyComponent,
    tFootComponent: TFootComponent,
  } = props;

  return <table className={styles.dataTable}>
    <THeadComponent {...props} />
    <TBodyComponent {...props}>
      {rows.map((row, index) => (<Row {...props} row={row} rowIndex={index} key={row.id} />))}
    </TBodyComponent>
    <TFootComponent {...props} />
  </table>
}

DataTable.defaultProps = {
  styles: defaultStyles,
  sortColumnName: null,
  setSortColumnName: null,
  sortColumnAsc: false,
  setSortColumnAsc: null,
  tHeadComponent: THead,
  tBodyComponent: TBody,
  tFootComponent: TFoot,
}


export default compose(

)(DataTable);


//Metatypes
function registerDatatableMetatype(name, getSortFunc, formatFunc = null, dataCellClass = null, headCellClass = null) {
  metatypes[name] = {
    name,
    formatFunc,
    getSortFunc,
    dataCellClass,
    headCellClass,
  };
}

const metatypes = {};

export function getMetaTypes() {
  return {...metatypes};
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
  (columnName, row, props) => (row.data[columnName])
);

registerDatatableMetatype(
  'number',
  (column, desc) => {
    return desc ?
      (a, b) => (a.data[column] - b.data[column])
      :
      (a, b) => (b.data[column] - a.data[column])
  },
  (column, row, props) => (<FormatNumber value={row.data[column]} langCode={props.langCode} />)
);

registerDatatableMetatype(
  'date',
  (column, desc) => {
    return desc ?
      (a, b) => (a.data[column] - b.data[column])
      :
      (a, b) => (b.data[column] - a.data[column])
  },
  (columnName, row, props) => (<Time value={row.data[columnName]} langCode={props.langCode} format="date" />)
);

registerDatatableMetatype(
  'datetime',
  (column, desc) => {
    return desc ?
      (a, b) => (a.data[column] - b.data[column])
      :
      (a, b) => (b.data[column] - a.data[column])
  },
  (columnName, row, props) => (<Time value={row.data[columnName]} langCode={props.langCode} format="datetime" />)
);
