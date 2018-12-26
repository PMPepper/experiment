import React from 'react';
import PropTypes from 'prop-types';

import Row from './Row';

import css from '@/helpers/css-class-list-to-string';

import isReactComponent from '@/prop-types/is-react-component';


export default function ExpandableRow(props) {
  const {row, rowIndex, styles, columns, stacked, getExpandedRowContents, rowComponent: RowComponent} = props;

  return [
    <RowComponent {...props} key="row" />,
    <tr className={css((rowIndex % 2) === 0 ? styles.expandTr : styles.expandTrEven, stacked && styles.expandTrStacked)} key="expand">
      <td className={css((rowIndex % 2) === 0 ? styles.expandTd : styles.expandTdEven, stacked && styles.expandTdStacked)} colSpan={columns.length}>
        <div className={css((rowIndex % 2) === 0 ? styles.expandContent : styles.expandContentEven, stacked && styles.expandContentStacked)}>
          {row.expanded && getExpandedRowContents && getExpandedRowContents(row)}
        </div>
      </td>
    </tr>
  ]

}


if(process.env.NODE_ENV !== 'production') {
  ExpandableRow.propTypes = {
    rowComponent: isReactComponent,
    getExpandedRowContents: PropTypes.func,
  };
}
