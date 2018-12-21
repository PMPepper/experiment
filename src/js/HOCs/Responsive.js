import React from 'react';
import {compose, getDisplayName} from 'recompose';

import MonitorSizeComponent from './MonitorSizeComponent';

function defaultSizeCheckFunc(props) {
  return props.sizeCheckFunc(props);
}

const sizeProps = ['outerWidth', 'outerHeight', 'innerWidth', 'innerHeight', 'scrollWidth', 'scrollHeight'];

export default function ResponsiveComponent(AlternativePresentationalComponent, sizeCheckFunc = defaultSizeCheckFunc, mapProps = null) {
  return (PresentationalComponent) => {
    return compose(
      MonitorSizeComponent()
    )(class extends React.Component {
      static displayName = `Responsive(${getDisplayName(PresentationalComponent)})`;

      _lastProps = {
        isUsingAlternativeComponent: false,
        innerWidth: null,
        innerHeight: null,
        outerWidth: null,
        outerHeight: null,
        scrollWidth: null,
        scrollHeight: null,
      };


      render() {
        //extract 'internal' props
        let {innerWidth, innerHeight, outerWidth, outerHeight, scrollWidth, scrollHeight, sizeCheckFunc: f, ...props} = this.props;

        const lastProps = this._lastProps;
        let useAlternativeComponent;

        //If any size props have changed...
        if(innerWidth !== lastProps.innerWidth ||
          innerHeight !== lastProps.innerHeight ||
          outerWidth !== lastProps.outerWidth ||
          outerHeight !== lastProps.outerHeight ||
          scrollWidth !== lastProps.scrollWidth ||
          scrollHeight !== lastProps.scrollHeight
        ) {
          //...re-check if alternative component should be changed...
          useAlternativeComponent = sizeCheckFunc(this.props, lastProps);

          //...and update 'last' props.
          lastProps.useAlternativeComponent = useAlternativeComponent;
          lastProps.innerWidth = innerWidth;
          lastProps.innerHeight = innerHeight;
          lastProps.outerWidth = outerWidth;
          lastProps.outerHeight = outerHeight;
          lastProps.scrollWidth = scrollWidth;
          lastProps.scrollHeight = scrollHeight;
        } else {
          //sizes haven't changed, just keep using same component
          useAlternativeComponent = lastProps.useAlternativeComponent
        }

        if(mapProps) {//map props (if applicable)
          props = mapProps(props);
        }

        //actually render correct component
        if(useAlternativeComponent) {
          return <AlternativePresentationalComponent {...props} />
        }

        return <PresentationalComponent {...props} />
      }
    });
  }
}
