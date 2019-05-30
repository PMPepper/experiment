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
)(function Select({options, inline, wide, columns, numberOfColumns, ...props}) {
  return <select {...combineProps(props, {className: css(styles.select, inline && styles.inline, inline && styles[columns || 'one'])})}>
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
});
