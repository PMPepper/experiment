import React, {useContext} from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Other
import {StyleContext} from './contexts';


//The component
const Label = React.forwardRef(function Label({width, hide, inline, component: Component = 'label', ...props}, ref) {
  const className = useGetLayoutClasses('label', 0, inline ? width : 0);
  const styles = useContext(StyleContext);

  return <Component {...combineProps(props, {className: css(className, hide && styles.hide, inline && styles.inline)})} ref={ref} />
});

export default Label;
