import React from 'react';
import PropTypes from 'prop-types';

import Row from './Row';

import FadeAndVerticalSlideAnimation from '@/components/transitions/FadeAndVerticalSlideAnimation';

import css from '@/helpers/css-class-list-to-string';

import isReactComponent from '@/prop-types/is-react-component';


export default function ExpandableRow(props) {
  const {
    row, rowIndex, styles, columns, stacked, clickTogglesExpandedRows, getExpandedRowContents, expandedRows, setRowExpanded,
    rowComponent: RowComponent,
    expandableRowContentComponent: ExpandableRowContentComponent,
    expandRowAnimation: ExpandRowAnimation
  } = props;

  const isRowExpanded = (expandedRows && expandedRows[row.id] && getExpandedRowContents);

  return [
    <RowComponent
      {...props}
      rowCssClasses={clickTogglesExpandedRows && styles.selectable}
      rowProps={clickTogglesExpandedRows ?
        {
          tabIndex: 0,
          onClick: () => {setRowExpanded(row.id, !expandedRows[row.id])},
          onKeyDown: (e) => {
            if(e.which === 13 || e.which === 32) {
              e.preventDefault();
              e.stopPropagation();

              setRowExpanded(row.id, !expandedRows[row.id])
            }
          }
        }
        :
        null
      }
      key="row"
    />,
    <tr
      className={css(
        (rowIndex % 2) === 0 ? styles.expandTr : styles.expandTrEven,
        stacked && styles.expandTrStacked,
        isRowExpanded && styles.expanded
      )}
      key="expand"
    >
      <td
        className={css(
          (rowIndex % 2) === 0 ? styles.expandTd : styles.expandTdEven,
          stacked && styles.expandTdStacked,
          isRowExpanded && styles.expanded
        )}
        colSpan={columns.length}
      >
        <ExpandRowAnimation
          className={css(
            (rowIndex % 2) === 0 ? styles.expandContent : styles.expandContentEven,
            stacked && styles.expandContentStacked,
            isRowExpanded && styles.expanded
          )}
        >
          {isRowExpanded && (ExpandableRowContentComponent ?
              <ExpandableRowContentComponent {...props}>{getExpandedRowContents(row)}</ExpandableRowContentComponent>
              :
              getExpandedRowContents(row)
            )
          }
        </ExpandRowAnimation>
      </td>
    </tr>
  ]

}

ExpandableRow.defaultProps = {
  expandRowAnimation: FadeAndVerticalSlideAnimation
};

if(process.env.NODE_ENV !== 'production') {
  ExpandableRow.propTypes = {
    rowComponent: isReactComponent,
    expandRowAnimation: isReactComponent,
    getExpandedRowContents: PropTypes.func,
  };
}
