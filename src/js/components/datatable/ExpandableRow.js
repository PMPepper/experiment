import React from 'react';
import PropTypes from 'prop-types';

import Row from './Row';

import FadeAndVerticalSlideAnimation from '@/components/transitions/FadeAndVerticalSlideAnimation';

import css from '@/helpers/css-class-list-to-string';
import reactCombineProps from '@/helpers/react-combine-props';

import isReactComponent from '@/prop-types/is-react-component';


export default class ExpandableRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandRowAnimationState: this.isExpanded ? 1 : 0
    };
  }

  get isExpanded() {
    const {row, expandedRows, getExpandedRowContents} = this.props;

    return expandedRows && expandedRows[row.id] && getExpandedRowContents
  }

  render() {
    const props = this.props;

    const {
      row, rowIndex, styles, columns, stacked,
      clickTogglesExpandedRows, getExpandedRowContents, expandedRows, setRowExpanded,
      rowProps,
      rowComponent: RowComponent,
      expandableRowContentComponent: ExpandableRowContentComponent,
      expandRowAnimation: ExpandRowAnimation
    } = props;

    const isRowExpanded = this.isExpanded;

    return [
      <RowComponent
        {...props}
        rowProps={reactCombineProps(
          rowProps,
          clickTogglesExpandedRows && {
            className: styles.selectable,
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
        )}
        key="row"
      />,
      <tr
        className={css(
          styles.expandTr,
          stacked && styles.stacked,
          isRowExpanded && styles.expanded
        )}
        key="expand"
      >
        <td
          className={css(
            styles.expandTd,
            stacked && styles.stacked,
            isRowExpanded && styles.expanded,
            this.state.expandRowAnimationState && styles.visible
          )}
          colSpan={columns.length}
        >
          <ExpandRowAnimation
            className={css(
              styles.expandContent,
              stacked && styles.stacked,
              isRowExpanded && styles.expanded
            )}
            onChangeAnimationState={(newState, oldState) => {
              this.setState({expandRowAnimationState: newState});
            }}
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
}

const emptyObj = {};

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
