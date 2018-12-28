import React from 'react';
import {getMetaTypes} from './DataTable';

import css from '@/helpers/css-class-list-to-string';
import reactCombineProps from '@/helpers/react-combine-props';


export default function Row(props) {
  let {
    row, rowIndex, columns, styles, stacked, sortColumnName, sortColumnDesc, setSortColumn, rowProps,
    clickTogglesSelectedRows, selectedRows, setRowSelected,
  } = props;

  const metaTypes = getMetaTypes();
  const isEven = rowIndex % 2 === 1;
  const isSelected = !!selectedRows[row.id];

  rowProps = reactCombineProps(
    rowProps,
    clickTogglesSelectedRows && {
      className: styles.selectable,
      onClick: () => {setRowSelected(row.id, !selectedRows[row.id])},
      onKeyDown: (e) => {
        if(e.which === 13 || e.which === 32) {
          e.preventDefault();
          e.stopPropagation();

          setRowSelected(row.id, !selectedRows[row.id])
        }
      }
    }
  );

  return <tr
    {...rowProps}
    className={css(
      styles.tr,
      isEven && styles.even,
      isSelected && styles.selected,
      stacked && styles.stacked,
      rowProps.className
    )}
  >
    {columns.map((column, columnIndex) => {
      const isSortColumn = column.name === sortColumnName;
      const columnLabel = column.label instanceof Function ? column.label(props) : column.label;

      return <td
        key={column.name}
        className={css(
          styles.td,
          column.valueType && styles[column.valueType],
          isSelected && styles.selected,
          stacked && styles.stacked,
          column.css
        )}
      >
        <div className={css(styles.tdHeader, stacked && styles.stacked, isSelected && styles.selected, column.css)} aria-hidden="true">
        {setSortColumn && column.sort ?
          <button
            className={css(
              styles.rowSortBtn,
              isSortColumn && sortColumnDesc && styles.desc,
              isSortColumn && !sortColumnDesc && styles.asc,
              isSelected && styles.selected,
              stacked && styles.stacked,
              column.css
            )}
            onClick={(e) => {e.preventDefault(); e.stopPropagation(); isSortColumn ? setSortColumn(column.name, !sortColumnDesc) : setSortColumn(column.name)}}
          >
            <span
              className={css(
                styles.rowSortBtnInner,
                isSortColumn && sortColumnDesc && styles.desc,
                isSortColumn && !sortColumnDesc && styles.asc,
                isSelected && styles.selected,
                stacked && styles.stacked,
                column.css
              )}
            >
              {columnLabel}
            </span>
          </button>
          :
          <span className={css(styles.rowLabel, isSelected && styles.selected, stacked && styles.stacked)}>{columnLabel}</span>
        }
        </div>{/*stack table contents*/}
        <div className={css(
          styles.tdContent,
          column.valueType && styles[column.valueType],
          isSelected && styles.selected,
          stacked && styles.stacked,
          column.css
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
