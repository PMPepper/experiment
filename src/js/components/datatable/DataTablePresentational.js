import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import defaultStyles from './styles.scss';


import Thead from './Thead';
import Tbody from './ExpandableRows';//Tbody
import Tfoot from './Tfoot';

import ResponsiveComponent, {makeCheckSizeWidthFunc} from '@/HOCs/ResponsiveComponent';

import css from '@/helpers/css-class-list-to-string';

import isReactComponent from '@/prop-types/is-react-component';



function DataTablePresentational({getRef = null, ...props}) {
  const {
    rows,
    styles,
    stacked,
    tHeadComponent: TheadComponent,
    tBodyComponent: TbodyComponent,
    tFootComponent: TfootComponent,
  } = props;

  return <div className={css(styles.dataTable, stacked && styles.stacked)} ref={getRef}>
    <table className={css(styles.table, stacked && styles.tableStacked)}>
      <TheadComponent {...props} />
      <TbodyComponent {...props} />
      <TfootComponent {...props} />
    </table>
  </div>
}

DataTablePresentational.defaultProps = {
  styles: defaultStyles,
  stacked: false,
  sortColumnName: null,
  sortColumnDesc: false,
  setSortColumn: null,
  tHeadComponent: Thead,
  tBodyComponent: Tbody,
  tFootComponent: Tfoot,
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
    rowComponent: isReactComponent,
  };
}

export default compose(
  ResponsiveComponent(
    makeCheckSizeWidthFunc('stacked')
  )
)(DataTablePresentational);

export const Display = DataTablePresentational;
