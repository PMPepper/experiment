import React from 'react';

import css from '@/helpers/css-class-list-to-string';


export default function THead({styles, columns, sortColumnName, sortColumnDesc, setSortColumn, stacked}) {

  return <thead className={css(styles.thead, stacked && styles.theadStacked)}>
    <tr className={styles.theadRow}>
      {columns.map((column, index) => {
        const isSortColumn = column.name === sortColumnName;
        const columnLabel = column.label instanceof Function ? column.label(props) : column.label;

        return <th key={column.name} className={css(
          (index % 2) === 0 ? styles.th : styles.thEven,
          isSortColumn && (sortColumnDesc ? styles.thSortDesc : styles.thSortAsc)
        )}>
          {setSortColumn && column.sort ?
            <button className={styles[isSortColumn ? (sortColumnDesc ? 'columnSortBtnDesc' : 'columnSortBtnAsc') : 'columnSortBtn']} onClick={() => {isSortColumn ? setSortColumn(column.name, !sortColumnDesc) : setSortColumn(column.name)}}>
              <span className={styles[isSortColumn ? (sortColumnDesc ? 'columnSortBtnInnerDesc' : 'columnSortBtnInnerAsc') : 'columnSortBtnInner']}>{columnLabel}</span>
            </button>
            :
            <span className={styles.columnLabel}>{columnLabel}</span>
          }
        </th>
      })}
    </tr>
  </thead>
}
