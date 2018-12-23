import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './styles.scss';


import THead from './THead';
import TBody from './TBody';
import Row from './Row';
import TFoot from './TFoot';


import isReactComponent from '@/prop-types/is-react-component';



export default function DataTablePresentational(props) {
  const {
    rows,
    styles,
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

DataTablePresentational.defaultProps = {
  styles: defaultStyles,
  sortColumnName: null,
  sortColumnDesc: false,
  setSortColumn: null,
  tHeadComponent: THead,
  tBodyComponent: TBody,
  tFootComponent: TFoot,
}

if(process.env.NODE_ENV !== 'production') {
  DataTablePresentational.propTypes = {
    styles: PropTypes.object,
    columns: PropTypes.array,//TODO proper shape
    rows: PropTypes.arrayOf(PropTypes.object),
    sortColumnName: PropTypes.string,
    sortColumnDesc: PropTypes.bool,
    setSortColumn: PropTypes.func,
    tHeadComponent: isReactComponent,
    tBodyComponent: isReactComponent,
    tFootComponent: isReactComponent,
  };
}
