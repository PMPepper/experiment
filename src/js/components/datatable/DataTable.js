import React from 'react';
import {compose} from 'recompose';
import defaultStyles from './styles.scss';


import THead from './THead';
import TBody from './TBody';
import Row from './Row';
import TFoot from './TFoot';


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
