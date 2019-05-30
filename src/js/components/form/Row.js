import React from 'react';
import {compose} from 'recompose';

import styles from './form.scss';

//HOCs
import NumberOfColumnsHOC from './NumberOfColumnsHOC';


//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


export default compose(
  NumberOfColumnsHOC
)(
  function Row({columns, numberOfColumns, children, ...props}) {
    return <div {...combineProps({className: css(styles.row, columns && styles[columns])}, props)}>{children}</div>
  }
);
