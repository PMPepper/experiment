import React from 'react';


export default function reactChildrenToArray(children) {
  return children ? React.Children.map(children, child => (child)) : [];
}
