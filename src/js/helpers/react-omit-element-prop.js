import React from 'react';

import objectOmit from './object-omit';


export default function reactOmitElementProp(element, ...omitProps) {
  return React.cloneElement(element, objectOmit(element.props, omitProps));
}
