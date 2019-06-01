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
)(function Label({children, hide, inline, component: Component = 'label', ...props}) {
  return <ColumnsContext.Consumer>{(columnsData) => {
    let columns = columnsData && columnsData.columns;

    return <Component {...combineProps(props, {className: css(styles.label, hide && styles.hide, inline && styles.inline, inline && styles[columns || 'one'])})}>{children}</Component>
  }}</ColumnsContext.Consumer>
});
