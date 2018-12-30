//TODO
//HOC that takes a reference to an element as a prop, monitors the elements position, and passes on as props
import React from 'react';
import {getDisplayName} from 'recompose';

import {addItem, removeItem} from  '@/modules/onFrameIterator';

import omit from '@/helpers/object/omit';


export default function({
  mapProps = (props, state) => ({...props, ...state}),
  elementProp = 'element'
} = {}) {
  return (PresentationalComponent) => {
    return class extends React.Component {
      static displayName = `GetElementPositionComponent(${getDisplayName(PresentationalComponent)})`;

      state = {
        position: {x: 0, y: 0, width: 0, height: 0}
      };

      constructor(props) {
        super(props);

        addItem(this._updatePosition);
      }

      componentWillUnmount() {
        removeItem(this._updatePosition);
      }

      _updatePosition = () => {
        const element = this.props[elementProp];

        if(element) {
          const boundingBox = element.getBoundingClientRect();

          this.setState({
            position: {
              x: boundingBox.left,
              y: boundingBox.top,
              width: boundingBox.right - boundingBox.left,
              height: boundingBox.bottom - boundingBox.top
            }
          });
        }
      }

      render() {
        return <PresentationalComponent {...mapProps(omit(this.props, [elementProp]), this.state)} />
      }
    };
  }
}
