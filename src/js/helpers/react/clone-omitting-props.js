import React from 'react';

import omit from '@/helpers/object/omit';


export default function cloneOmittingProps(element, ...omitProps) {
  const newProps = omit(element.props, omitProps);

  if(element.key) {
    newProps.key = element.key;
  }

  //not 100% sure about this..?
  if(element.ref) {
    newProps.ref = element.ref;
  }

  return React.createElement(element.type, newProps);
}
