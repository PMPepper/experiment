import React from 'react';
import defaultStyles from './styles.scss';

import combineProps from '@/helpers/react/combine-props';

export default function Cell({component: Component, styles, children, ...rest}) {
  return <Component {...combineProps({
    className: styles.cell,
  }, rest)}>
    {children}
  </Component>
}

Cell.defaultProps = {
  component: 'div',
  styles: defaultStyles,
};
