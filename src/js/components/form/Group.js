//A group of semantically grouped inputs.

import React from 'react';
import {compose} from 'recompose';

import styles from './form.scss';

//HOCs
import NumberOfColumnsHOC from './NumberOfColumnsHOC';

//Components
import Legend from './Legend';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import getChildrenOfType from '@/helpers/react/get-children-of-type';

//Contexts
import {ColumnsContext} from './Form';


//The component
export default compose(
  NumberOfColumnsHOC
)(function Group({numberOfColumns, columns, wide, children, ...props}) {
  const legends = getChildrenOfType(children, Legend);

  if(legends.length > 1) {
    throw new Error('Group may not have more than 1 legend');
  }

  return <ColumnsContext.Consumer>{(columnsData) => {
    const columns = columnsData && columnsData.columns;

    return <fieldset {...combineProps({className: css(styles.group, legends.length === 1 && styles.hasLegend, columns && styles[columns])}, props)}>
      {children}
    </fieldset>
  }}</ColumnsContext.Consumer>
});
