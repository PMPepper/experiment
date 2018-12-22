import React from 'react';



export default function THead({styles, columns, sortColumnName, setSortColumnName, sortColumnAsc, setSortColumnAsc}) {
  return <thead className={styles.thead}>
    <tr className={styles.tHeadRow}>
      {columns.map((column, index) => {
        const isSortColumn = column.name === sortColumnName;
        const classes = [(index % 2) === 0 ? styles.th : styles.thEven];

        if(isSortColumn) {
          classes.push(sortColumnAsc ? styles.thSortAsc : styles.thSortDesc);
        }

        const columnLabel = column.label instanceof Function ? column.label(props) : column.label;

        return <th key={column.name} className={classes.join(' ')}>
          {setSortColumnName && column.sort ?
            <button className={styles[isSortColumn ? (sortColumnAsc ? 'columnSortBtnAsc' : 'columnSortBtnDesc') : 'columnSortBtn']} onClick={isSortColumn ? () => {setSortColumnAsc && setSortColumnAsc(!sortColumnAsc)} : () => {setSortColumnName(column.name)}}>{columnLabel}</button>
            :
            <span className={styles.columnLabel}>{columnLabel}</span>
          }
        </th>
      })}
    </tr>
  </thead>
}
