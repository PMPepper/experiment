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
)(
  function Row({children, ...props}) {
    return <ColumnsContext.Consumer>{(columnsData) => {
      const columns = columnsData && columnsData.columns;

      return <div {...combineProps({className: css(styles.row, styles[columns || 'one'])}, props)}>{children}</div>
    }}</ColumnsContext.Consumer>
  }
);
