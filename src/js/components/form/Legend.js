import React, {useContext} from 'react';

import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Other
import {StyleContext} from './contexts';


const Legend = React.forwardRef(function Legend({children, label, ...props}, ref) {
  const styles = useContext(StyleContext);
  
  return <legend {...combineProps(props, {className: css(styles.legend, label && styles.asLabel)})} ref={ref}>{children}</legend>
})

export default Legend;
