import React from 'react';
import PropTypes from 'prop-types';
import rangeInclusive from 'range-inclusive';
import {compose} from 'recompose';

import defaultStyles from './styles.scss';

import Icon from '@/components/icon/Icon';

import css from '@/helpers/css-class-list-to-string';

import isPositiveInteger from '@/prop-types/is-positive-integer';
import isPositiveNonZeroInteger from '@/prop-types/is-positive-nonzero-integer';


//This component is Pure
export default function Pagination(props) {
  const {page, itemsPerPage, numItems, onRequestPagination, pagesToDisplay, className, styles, getRef, ...rest} = props;
  const totalPages = Math.ceil(numItems / itemsPerPage);

  if(totalPages <= 1) {
    return null;
  }

  const offsetCount = Math.floor((pagesToDisplay - 5)/2); //how many numbers beside the current page should be shown, e.g. if pagesToDisplay = 7, page = 6 and totalPages = 10, then 1 ... 5, 6, 7 ... 10 offset count is 1 (1 back and 1 forward from the current page)

  return <div {...rest} ref={getRef} className={css(styles.pagination, className)}>
    <button
      disabled={page === 1}
      onClick={onRequestPagination ? (e) => {onRequestPagination(page - 1, e);} : null}
      className={css(styles.prevBtn, page === 1 && styles.disabled)}
      type="button"
    >
      <Icon icon="chevron-left" />
      {/*TODO <span className="u-offscreen"><Text id="pagination-next" /></span>*/}
    </button>

    {rangeInclusive(1, Math.min(totalPages, pagesToDisplay)).map((position) => {
      return renderPosition(position, totalPages, offsetCount, props);
    })}

    <button
      disabled={page === totalPages}
      onClick={onRequestPagination ? (e) => {onRequestPagination(page + 1, e);} : null}
      className={css(styles.nextBtn, page === totalPages && styles.disabled)}
      type="button"
    >
      <Icon icon="chevron-right" />
      {/*TODO <span className="u-offscreen"><Text id="pagination-next" /></span>*/}
    </button>
  </div>
}

Pagination.defaultProps = {
  pagesToDisplay: 7,
  getRef: null,
  className: '',
  styles: defaultStyles,
};

if(process.env.NODE_ENV !== 'production') {
  Pagination.propTypes = {
    page: isPositiveNonZeroInteger.isRequired,
    itemsPerPage: isPositiveNonZeroInteger.isRequired,
    numItems: isPositiveInteger.isRequired,
    onRequestPagination: PropTypes.func,
    pagesToDisplay: function(props, propName, componentName) {
      const value = props[propName];

      if(!Number.isInteger(value) || value < 2 || value % 2 === 0) {
        return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Must be an odd positive nonzero integer. Validation failed`)
      }
    },
  }
}

//Internal helpers
function renderPosition(position, totalPages, offsetCount, props) {
  const {pagesToDisplay, numItems, itemsPerPage, page, styles} = props;

  if(position == 1) {
    return renderPage(1, props);//start
  } else if(position == pagesToDisplay) {
    return renderPage(totalPages, props);//end
  }

  if((position === 2 && page > 4) || ((position == (pagesToDisplay-1)) && ((totalPages - page) >= 4))) {
    return <Icon key={`spacer-${position}`} className={styles.spacer} icon="ellipsis-h" />
  }

  //map position to page
  let positionCurrentPageOffset = 3 + offsetCount;//er?

  //once you rearch the end, minus more from the start (-4 becomes -5, etc)
  if(page + offsetCount + 2 > totalPages) {
    positionCurrentPageOffset -= totalPages - page - offsetCount - 2;
  }

  return renderPage(position + Math.max(0, page - positionCurrentPageOffset), props);
}

function renderPage(thisPage, {page, totalPages, onRequestPagination, styles}) {
  const classes = [styles.page];

  thisPage === 1 && classes.push(styles.first);
  thisPage === totalPages && classes.push(styles.last);
  thisPage === page && classes.push(styles.current);

  if(thisPage === page) {
    return <span key={thisPage} className={classes.join(' ')}>{thisPage}</span>
  }

  return <button key={thisPage} className={classes.join(' ')} type="button" onClick={onRequestPagination ? (e) => {onRequestPagination(thisPage, e);} : null}>{thisPage}</button>
}
