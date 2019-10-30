import React from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


//The component
const Column = React.forwardRef(function Column({columns, width, ...props}, ref) {
  const className = useGetLayoutClasses('column', columns, width);

  return <div {...combineProps({className}, props)} ref={ref} />
});


export default Column
