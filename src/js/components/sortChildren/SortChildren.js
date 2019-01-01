import React from 'react';
import PropTypes from 'prop-types';

//Components
import RenderChildren from '@/components/renderChildren/RenderChildren';

//Helpers
import childrenToArray from '@/helpers/react/children-to-array';

//Prop types
import isReactComponent from '@/prop-types/is-react-component';


//The component
export default function SortChildren({
  children,
  sort,
  mapChild,
  component: Component,
  ...rest
}) {
  children = childrenToArray(children);
  children.sort(sort);

  if(mapChild) {
    children = children.map(mapChild);
  }

  return <Component {...rest}>
    {children}
  </Component>
}

SortChildren.defaultProps = {
  component: RenderChildren,
}

if(process.env.NODE_ENV !== 'production') {
  SortChildren.propTypes = {
    component: isReactComponent,
    sort: PropTypes.func.isRequired,
    mapChild: PropTypes.func,
  }
}
