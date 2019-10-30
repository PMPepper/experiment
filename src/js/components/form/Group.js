//A group of semantically grouped inputs.

import React, {useContext} from 'react';

//Components
import Legend from './Legend';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import getChildrenOfType from '@/helpers/react/get-children-of-type';

//Other
import {StyleContext} from './contexts';


//The component
const Group = React.forwardRef(function Group({columns, width, ...props}, ref) {
  const className = useGetLayoutClasses('group', columns, width);
  const legends = getChildrenOfType(props.children, Legend);
  const styles = useContext(StyleContext);

  if(legends.length > 1) {
    throw new Error('Group may not have more than 1 legend');
  }

  return <fieldset {...combineProps({className: css(className, legends.length === 1 && styles.hasLegend)}, props)} ref={ref} />
});

export default Group;
