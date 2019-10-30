import React, {useContext} from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Other
import {StyleContext} from './contexts';


//The component
const Select = React.forwardRef(function Select({options, width, inline, ...props}, ref) {
  const className = useGetLayoutClasses('select', 0, inline ? width : 0);
  const styles = useContext(StyleContext);

  return <select {...combineProps(props, {className: css(className, inline && styles.inline)})} ref={ref}>
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
});

export default Select;
