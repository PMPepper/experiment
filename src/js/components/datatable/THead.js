import React from 'react';

import css from '@/helpers/css-class-list-to-string';


export default function Thead({styles, columns, sortColumnName, sortColumnDesc, setSortColumn, stacked}) {

  return <thead className={css(styles.thead, stacked && styles.stacked)}>
    <tr className={styles.theadRow}>
      {columns.map((column, index) => {
        const isSortColumn = column.name === sortColumnName;
        const columnLabel = column.label instanceof Function ? column.label(props) : column.label;

        return <th key={column.name} className={css(
          styles.th,
          isSortColumn && sortColumnDesc && styles.desc,
          isSortColumn && !sortColumnDesc && styles.asc,
          column.css
        )}>
          {setSortColumn && column.sort ?
            <button
              className={css(
                styles.columnSortBtn,
                isSortColumn && sortColumnDesc && styles.desc,
                isSortColumn && !sortColumnDesc && styles.asc,
                column.css
              )}
              onClick={(e) => {e.preventDefault(); e.stopPropagation(); isSortColumn ? setSortColumn(column.name, !sortColumnDesc) : setSortColumn(column.name)}}
            >
              <span className={css(
                styles.columnSortBtnInner,
                isSortColumn && sortColumnDesc && styles.desc,
                isSortColumn && !sortColumnDesc && styles.asc,
                column.css
              )}>{columnLabel}</span>
            </button>
            :
            columnLabel ? <span className={styles.columnLabel}>{columnLabel}</span> : null
          }
        </th>
      })}
    </tr>
  </thead>
}
