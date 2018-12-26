import React from 'react';

import isRenderable from './react-is-renderable';

export default function hasAnyRenderableChildren(children) {
  return React.Children.toArray(children).some(isRenderable);
}
