import React from 'react';
import {getMetaTypes} from './DataTable';

import css from '@/helpers/css-class-list-to-string';


export default function Row(props) {
  const {row, rowIndex, columns, styles, stacked, sortColumnName, sortColumnDesc, setSortColumn} = props;
  const metaTypes = getMetaTypes();

  return <tr className={css((rowIndex % 2) === 0 ? styles.tr : styles.trEven, stacked && styles.trStacked)}>
    {columns.map((column, columnIndex) => {
      const isSortColumn = column.name === sortColumnName;
      const columnLabel = column.label instanceof Function ? column.label(props) : column.label;

      return <td
        key={column.name}
        className={css(
          (columnIndex % 2) === 0 ? styles.td : styles.tdEven,
          column.valueType && styles[`td_type_${column.valueType}`],
          stacked && styles.tdStacked
        )}
      >
        <div className={styles.tdHeader} aria-hidden="true">
        {setSortColumn && column.sort ?
          <button className={styles[isSortColumn ? (sortColumnDesc ? 'rowSortBtnDesc' : 'rowSortBtnAsc') : 'rowSortBtn']} onClick={() => {isSortColumn ? setSortColumn(column.name, !sortColumnDesc) : setSortColumn(column.name)}}>
            <span className={styles[isSortColumn ? (sortColumnDesc ? 'rowSortBtnInnerDesc' : 'rowSortBtnInnerAsc') : 'rowSortBtnInner']}>{columnLabel}</span>
          </button>
          :
          <span className={styles.rowLabel}>{columnLabel}</span>
        }
        </div>{/*stack table contents*/}
        <div className={css(
          styles.tdContent,
          column.valueType && styles[`tdContent_type_${column.valueType}`],
          stacked && styles.tdContentStacked
        )}>
          {formatCellData(row, column, props, metaTypes)}
        </div>
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
