import React from 'react';

import omit from 'lodash/omit';


export default function reactOmitElementProp(element, ...omitProps) {
  return React.cloneElement(element, omit(element.props, omitProps));
}
