import React from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


//The component
const Button = React.forwardRef(function Button({width, ...props}, ref) {
  const className = useGetLayoutClasses('button', 0, width);

  return <button {...combineProps({className}, props)} ref={ref} />
});

Button.defaultProps = {
  type: 'button'
}

export default Button
