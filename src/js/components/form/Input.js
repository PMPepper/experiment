import React from 'react';
import {compose} from 'recompose';

import styles from './form.scss';

//HOCs
import NumberOfColumnsHOC from './NumberOfColumnsHOC';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Contexts
import {ColumnsContext} from './Form';


//The component
export default compose(
  NumberOfColumnsHOC
)(function Input({inline, ...props}) {
  return <ColumnsContext.Consumer>{(columnsData) => {
    let columns = columnsData && columnsData.columns;

    return <input {...combineProps(props, {className: css(styles.input, inline && styles.inline, inline && styles[columns || 'one'])})} />
  }}</ColumnsContext.Consumer>
});
