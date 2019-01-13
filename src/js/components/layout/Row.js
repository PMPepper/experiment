import React from 'react';
import defaultStyles from './styles.scss';

import combineProps from '@/helpers/react/combine-props';
import cloneOmittingProps from '@/helpers/react/clone-omitting-props';

export default function Row({component: Component, styles, breakpoint, breakpointNames, children, ...rest}) {

  return <Component {...combineProps({
    className: styles.row,
  }, rest)}>
    {React.Children.map(children, (child) => {
      //get the desired number of columns for this cell
      const columns = child.props[breakpoint.name] || 1;
      const fraction = columns / breakpoint.columns;

      return cloneOmittingProps(child, breakpointNames, {style: {...child.props.style, flexBasis: `${fraction * 100}%`}});
    })}
  </Component>
}

Row.defaultProps = {
  component: 'div',
  styles: defaultStyles,
};
