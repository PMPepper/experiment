import React, {useContext} from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Other
import {StyleContext} from './contexts';


//The component
const Select = React.forwardRef(function Select({options, width, inline, setValue, placeholder, ...props}, ref) {
  const className = useGetLayoutClasses('select', 0, inline ? width : 0);
  const styles = useContext(StyleContext);

  if(placeholder) {
    options = [
      {value: '', label: placeholder},
      ...options
    ];
  }

  return <select {...combineProps(props, {className: css(className, inline && styles.inline), onChange: (e) => {setValue(e.target.value, e)}})} ref={ref}>
    {options.map(option => (
      option.options ?
        <optgroup label={option.label} key={option.key || option.label}>
          {option.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </optgroup>
        :
        <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
});

export default Select;
