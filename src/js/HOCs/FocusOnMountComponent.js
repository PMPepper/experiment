import React from 'react';
import {getDisplayName} from 'recompose';

export default function({
  returnFocusOnUnmount = false
} = {}) {
  return (PresentationalComponent) => {
    const isDOMComponent = typeof(PresentationalComponent) === 'string';

    return class FocusOnMountComponent extends React.Component {
      _initialFocusElement = null;
      _element;

      componentWillMount() {
        if(returnFocusOnUnmount) {
          this._initialFocusElement = document.activeElement
        }
      }
      componentDidMount() {
        if(this._element) {
          this._element.focus();
        }
      }

      componentWillUnmount() {
        this._element = null;

        if(returnFocusOnUnmount && this._initialFocusElement) {
          //TODO check if element still exists (is in DOM)? If not...?
          this._initialFocusElement.focus();

          this._initialFocusElement = null;
        }
      }

      _getRef = (element) => {
        this._element = element;
      }

      render() {
        const props = this.props;

        return isDOMComponent ?
          <PresentationalComponent {...props} ref={this._getRef} />
          :
          <PresentationalComponent {...props} getRef={this._getRef} />
      }

      displayName = `FocusOnMountComponent(${getDisplayName(PresentationalComponent)})`
    };
  }
}
