//Used to contain non-form content within a form layout
import React from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


//The component
const Container = React.forwardRef(function Container({width, ...props}, ref) {
  const className = useGetLayoutClasses('container', 0, width);

  return <div {...combineProps({className}, props)} ref={ref} />
});


export default Container
