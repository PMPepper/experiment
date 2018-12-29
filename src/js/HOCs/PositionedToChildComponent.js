//NOT SURE I WANT/NEED THIS
/*
import React from 'react';
import {compose, getDisplayName} from 'recompose';


//HOCs
import PositionedItemComponent, {afterOrBefore, startOrEnd} from './PositionedItemComponent';


export default function PositionedToChildComponent({
  mapLinkedProps = ({positionedToChildElement, tick, setPositionedToChildElement, ...props}, child, showLinkedElement) => {
    return props;
  },
  mapChildProps = (props, child, showPositionedElement) => {
    return {
      key: child.key || 'child',
      ref: props.setPositionedToChildElement
    }
  },
  xPosRule = afterOrBefore,
  yPosRule = startOrEnd,
  mapPositionedItemProps = undefined,
  usePortal = true
} = {}) {
  return (PresentationalComponent) => {
    const PositionedPresentationalComponent = PositionedItemComponent({
      xPosRule,
      yPosRule,
      mapProps: mapPositionedItemProps,
      usePortal
    })(PresentationalComponent);

    const Component = ({children, showPositionedElement, ...props}) => {
      const child = React.Children.only(children);

      return [
        React.cloneElement(child, mapChildProps(props, child, showPositionedElement)),
        showPositionedElement && <PositionedPresentationalComponent key="presentational" {...mapLinkedProps(props, child, showPositionedElement)} />
      ];
    };

    Component.displayName = `PositionedToChildComponent(${getDisplayName(PresentationalComponent)})`

    return compose(
      WithStateHandlersComponent({
        positionedToChildElement: null,
        //Position props used by PositionedItemComponent
        positionX: 0,
        positionY: 0,
        positionWidth: 0,
        positionHeight: 0
      }, {
        setPositionedToChildElement: () => (positionedToChildElement) => ({positionedToChildElement})
      }, {
        withPropsOnChange: [
          //Every tick, check the positionedToChildElement for it's position
          ['tick'],
          ({positionedToChildElement}) => {
            if(!positionedToChildElement) {
              return;
            }

            const bounds = positionedToChildElement.getBoundingClientRect();

            //TODO allow relative positions (position: absolute)?

            return {
              positionX: bounds.left,
              positionY: bounds.top,
              positionWidth: bounds.right - bounds.left,
              positionHeight: bounds.bottom - bounds.top,
            };
          }
        ],
        mapProps: ({tick, ...rest}) => {
          return rest;
        }
      })
    )(Component);
  };
}
*/
