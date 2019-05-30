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

//A group of semantically grouped inputs.

export default compose(
  NumberOfColumnsHOC
)(function Group({numberOfColumns, columns, wide, children, ...props}) {
  const legends = getChildrenOfType(children, Legend);

  if(legends.length > 1) {
    throw new Error('Group may not have more than 1 legend');
  }

  return <fieldset {...combineProps({className: css(styles.group, legends.length === 1 && styles.hasLegend, wide && styles.wide, columns && styles[columns])}, props)}>
    {children}
  </fieldset>
});
