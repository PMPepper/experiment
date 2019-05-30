import React from 'react';
import {compose} from 'recompose';

import styles from './form.scss';

//HOCs
import NumberOfColumnsHOC from './NumberOfColumnsHOC';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


//The component
export default compose(
  NumberOfColumnsHOC
)(function Label({children, hide, inline, wide, columns, numberOfColumns, ...props}) {
  return <label {...combineProps(props, {className: css(styles.label, hide && styles.hide, inline && styles.inline, inline && styles[columns || 'one'])})}>{children}</label>
});
