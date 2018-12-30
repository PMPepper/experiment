import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';

import {addItem, removeItem} from  '@/modules/onFrameIterator';

import omit from '@/helpers/object/omit';
import outerWidth from '@/helpers/dom/get-element-outer-width';
import outerHeight from '@/helpers/dom/get-element-outer-height';


export default function MonitorElementSizeComponent({
  setSizeCallbackFuncPropName = 'setPositionedItemSize',
  mapProps = null
} = {}) {
  return (PresentationalComponent) => {
    const isDOMElement = typeof(PresentationalComponent) === 'string';

    return class extends React.Component {
      static displayName = `MonitorElementSizeComponent(${getDisplayName(PresentationalComponent)})`;
      static propTypes = {
        [setSizeCallbackFuncPropName]: PropTypes.func
      }

      _ref = null;

      constructor(props) {
        super(props);

        addItem(this._updateSize);
      }

      componentWillUnmount() {
        removeItem(this._updateSize);
      }

      _updateSize = () => {
        const ref = this._ref;

        if(ref) {
          const setSizeCallbackFunc = this.props[setSizeCallbackFuncPropName];

          setSizeCallbackFunc && setSizeCallbackFunc(outerWidth(ref), outerHeight(ref));
        }
      }

      _getRef = (ref) => {
        this.props.getRef && this.props.getRef(ref);

        this._ref = ref;
      }

      render() {
        const props = omit(this.props, [setSizeCallbackFuncPropName]);

        const mappedProps = mapProps ? mapProps(props) : props;

        return isDOMElement ?
          <PresentationalComponent {...mappedProps} ref={this._getRef} />
          :
          <PresentationalComponent {...mappedProps} getRef={this._getRef} />;
      }
    }
  }
}
