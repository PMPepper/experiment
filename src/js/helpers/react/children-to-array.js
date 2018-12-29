import React from 'react';


export default function childrenToArray(children) {
  return children ? React.Children.map(children, child => (child)) : [];
}
