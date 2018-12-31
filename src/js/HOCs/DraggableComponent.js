import React from 'react';
import {getDisplayName} from 'recompose';

//helpers
import combineProps from '@/helpers/react/combine-props';
import omit from '@/helpers/object/omit';

//The HOC
export default function({
  moveBy = (props, x, y) => {
    props.moveBy && props.moveBy(x, y)
  },
  mapProps = (props, draggingProps) => {
    return combineProps(omit(props, ['moveBy']), draggingProps);
  }
} = {}) {
  return (PresentationalComponent) => {
    return class ReduxDraggableComponent extends React.Component {
      _lastX = null;
      _lastY = null;

      constructor(props) {
        super(props);

        this._draggingProps = {
          onMouseDown: this._onMouseDown,
          className: 'draggable'
        };
      }

      _onMouseDown = (e) => {
        e.preventDefault();

        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mouseup', this._onMouseUp);

        this._lastX = e.clientX;
        this._lastY = e.clientY;
      }

      _onMouseMove = (e) => {
        e.preventDefault();
        
        moveBy(this.props, e.clientX - this._lastX, e.clientY - this._lastY);

        this._lastX = e.clientX;
        this._lastY = e.clientY;
      }

      _onMouseUp = (e) => {
        e.preventDefault();

        this._endDragging();
      }

      _endDragging() {
        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('mouseup', this._onMouseUp);
      }

      render() {
        return <PresentationalComponent {...mapProps(this.props, this._draggingProps)} />
      }

      displayName = `ReduxDraggableComponent(${getDisplayName(PresentationalComponent)})`
    };
  }
}
