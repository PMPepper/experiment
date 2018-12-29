import React from 'react';

import omit from '@/helpers/object/omit';


export default function cloneOmittingProps(element, ...omitProps) {
  return React.cloneElement(element, omit(element.props, omitProps));
}
