import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import defaultStyles from './styles.scss';


import THead from './THead';
import TBody from './TBody';
import Row from './Row';
import TFoot from './TFoot';

import ResponsiveComponent, {makeCheckSizeWidthFunc} from '@/HOCs/ResponsiveComponent';

import css from '@/helpers/css-class-list-to-string';

import isReactComponent from '@/prop-types/is-react-component';



function DataTablePresentational({getRef = null, ...props}) {
  const {
    rows,
    styles,
    stacked,
    tHeadComponent: THeadComponent,
    tBodyComponent: TBodyComponent,
    tFootComponent: TFootComponent,
  } = props;

  return <div className={css(styles.dataTable, stacked && styles.stacked)} ref={getRef}>
    <table className={css(styles.table, stacked && styles.tableStacked)}>
      <THeadComponent {...props} />
      <TBodyComponent {...props}>
        {rows.map((row, index) => (<Row {...props} row={row} rowIndex={index} key={row.id} />))}
      </TBodyComponent>
      <TFootComponent {...props} />
    </table>
  </div>
}

DataTablePresentational.defaultProps = {
  styles: defaultStyles,
  stacked: false,
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
    stacked: PropTypes.bool,
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

export default compose(
  ResponsiveComponent(
    makeCheckSizeWidthFunc('stacked')
  )
)(DataTablePresentational);

export const Display = DataTablePresentational;
