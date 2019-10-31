//Used to contain non-form content within a form layout
import React from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


//The component
const Output = React.forwardRef(function Output({width, ...props}, ref) {
  const className = useGetLayoutClasses('output', 0, width);

  return <output {...combineProps({className}, props)} ref={ref} />
});


export default Output
