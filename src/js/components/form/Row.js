import React, {useContext} from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';


//The component
const Row = React.forwardRef(function Row({columns, width, ...props}, ref) {
  const className = useGetLayoutClasses('row', columns, width);

  return <div {...combineProps({className}, props)} ref={ref} />
});


export default Row;
