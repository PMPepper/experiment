import React from 'react';

import styles from './buttons.scss';

import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';
import hasAnyRenderableChildren from '@/helpers/react/has-any-renderable-children';


//The component
const Buttons = React.forwardRef(function Button({position, ...props}, ref) {
  if(!hasAnyRenderableChildren(props.children)) {
    return null;
  }

  return <div {...combineProps({
    className: css(styles.buttons, styles[`position-${position}`])
  }, props)} ref={ref} />
});

Buttons.defaultProps = {
  position: 'left'
};

export default Buttons;
