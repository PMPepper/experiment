import React, {useContext} from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Other
import {StyleContext} from './contexts';


//The component
const Textarea = React.forwardRef(function Textarea({inline, width, setValue, ...props}, ref) {
  const className = useGetLayoutClasses('textarea', 0, inline ? width : 0);
  const styles = useContext(StyleContext);

  return <textarea {...combineProps(props, {className: css(className, inline && styles.inline), onChange: (e) => {setValue(e.target.value, e)}})} ref={ref} />
});

export default Textarea;
