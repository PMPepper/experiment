import React from 'react';
import PropTypes from 'prop-types';

import Row from './Row';

import css from '@/helpers/css-class-list-to-string';

import isReactComponent from '@/prop-types/is-react-component';


export default function Tbody(props) {
  const {styles, rows, stacked, rowComponent: RowComponent} = props;

  return <tbody className={css(styles.tbody, stacked && styles.tbodyStacked)}>
    {rows.map((row, index) => (<RowComponent {...props} row={row} rowIndex={index} key={row.id} />))}
  </tbody>
}

Tbody.defaultProps = {
  rowComponent: Row,
};

if(process.env.NODE_ENV !== 'production') {
  Tbody.propTypes = {
    rowComponent: isReactComponent
  };
}
