import React from 'react';




export default function Row(props) {
  const {row, rowIndex, columns, styles} = props;

  return <tr className={(rowIndex % 2) === 0 ? styles.tr : styles.trEven}>
    {columns.map((column, columnIndex) => {
      const classes = [(columnIndex % 2) === 0 ? styles.td : styles.tdEven];

      if(column.valueType && styles[`td_type_${column.valueType}`]) {
        classes.push(styles[`td_type_${column.valueType}`]);
      }

      return <td key={column.name} className={classes.join(' ')}>
        {formatCellData(row, column, props)}
      </td>
    })}
  </tr>
}

function formatCellData(row, column, props) {
  const value = row.data[column.name];

  if(column.format) {
    return column.format(value, row, props)
  }

  switch(column.valueType) {
    case 'number':
      return value;//TODO format number
  }

  return value;
}
