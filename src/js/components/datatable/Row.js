import React from 'react';
import {getMetaTypes} from './DataTable';



export default function Row(props) {
  const {row, rowIndex, columns, styles} = props;
  const metaTypes = getMetaTypes();

  return <tr className={(rowIndex % 2) === 0 ? styles.tr : styles.trEven}>
    {columns.map((column, columnIndex) => {
      const classes = [(columnIndex % 2) === 0 ? styles.td : styles.tdEven];

      if(column.valueType && styles[`td_type_${column.valueType}`]) {
        classes.push(styles[`td_type_${column.valueType}`]);
      }

      return <td key={column.name} className={classes.join(' ')}>
        {formatCellData(row, column, props, metaTypes)}
      </td>
    })}
  </tr>
}

function formatCellData(row, column, props, metaTypes) {
  const value = row.data[column.name];

  //If column has custom format method use that
  if(column.format) {
    return column.format(value, column, row, props)
  }

  //Otherwise use metatype (defaults to string)
  const metaType = column.valueType && metaTypes.hasOwnProperty(column.valueType) ? metaTypes[column.valueType] : metaTypes.string;

  return metaType.formatFunc(value, column, row, props);
}
