import React from 'react';

import ExpandableRow from './ExpandableRow';
import Row from './Row';

import css from '@/helpers/css/class-list-to-string';

import isReactComponent from '@/prop-types/is-react-component';


export default function ExpandableRows(props) {
  const {styles, rows, stacked, expandableRowComponent: ExpandableRowComponent} = props;

  return rows.map((row, index) => (<tbody className={css(styles.tbody, stacked && styles.stacked)} key={row.id}>
    <ExpandableRowComponent {...props} row={row} rowIndex={index} />
  </tbody>))
}


ExpandableRows.defaultProps = {
  rowComponent: Row,
  expandableRowComponent: ExpandableRow,
  expandableRowContentComponent: null
};

if(process.env.NODE_ENV !== 'production') {
  ExpandableRows.propTypes = {
    rowComponent: isReactComponent,
    expandableRowComponent: isReactComponent,
    expandableRowContentComponent: isReactComponent,
  };
}
