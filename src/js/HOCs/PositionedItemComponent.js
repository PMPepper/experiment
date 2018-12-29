import React from 'react';
import ReactDOM from 'react-dom';
import memoize from 'memoize-one';
import {getDisplayName} from 'recompose';

import omit from '@/helpers/object/omit';
import combineProps from '@/helpers/react/combine-props';


/*
Needs:
-position: x/y coords and optional width/height (window coords)
-bounds (optional): x/y/width/height of bounding area for positioning (window coords)

Default passes props:
-setPositionedItemSize: function to allow child to tell this component how big the child is (can use in combination with MonitorElementSizeComponent)
-style: object with styles for specifying how to position

*/

//The component
export default function PositionedItemComponent({
  defaultPortalElement = document.body,
  usePortal = true,
  xPosRule = alignStart,
  yPosRule = afterOrBefore,
  positionProp = 'position',
  boundsProp = 'bounds',
  zIndexProp = 'positionedItemZIndex',
  mapProps = (props, positionedCoords, setPositionedItemSize) =>
  {
    return combineProps(
      omit(props, ['portalElement', positionProp, boundsProp, zIndexProp]),
      {
        style: {
          position: 'fixed',
          zIndex: props[zIndexProp] || 10,
          left: `${positionedCoords.x}px`,
          top: `${positionedCoords.y}px`,
        },
        setPositionedItemSize
      }
    )
  }
} = {}) {
  return (PresentationalComponent) => {
    return class extends React.Component {
      static displayName = `PositionedItemComponent${getDisplayName(PresentationalComponent)}`;

      state = {
        contentWidth: 0,
        contentHeight: 0
      };

      setPositionedItemSize = (contentWidth = 0, contentHeight = 0) => {
        if(contentWidth !== this.state.contentWidth || contentHeight !== this.state.contentHeight) {
          this.setState({contentWidth, contentHeight});
        }
      }

      //calculate where the element should be positioned
      getPositionedCoords = memoize((contentWidth, contentHeight, boundsX, boundsY, boundsWidth, boundsHeight, positionX, positionY, positionWidth, positionHeight) => {
        return {
          x: xPosRule(contentWidth, boundsX, boundsWidth, positionX, positionWidth),
          y: yPosRule(contentHeight, boundsY, boundsHeight, positionY, positionHeight),
        };
      })


      render() {
        const props = this.props;
        const state = this.state;

        const bounds = props[boundsProp] || emptyObj;
        const position = props[positionProp] || emptyObj;

        //calculate the position
        const positionedCoords = this.getPositionedCoords(
          state.contentWidth, state.contentHeight,
          bounds.x || null, bounds.y || null, bounds.width || null, props.height || null,
          position.x || 0, position.y || 0, position.width || 0, position.height || 0
        );

        //map the props
        const mappedProps = mapProps(props, positionedCoords, this.setPositionedItemSize);

        //create the PresentationalComponent element
        const element = <PresentationalComponent {...mappedProps} />;

        //if needed create portal
        return usePortal ? ReactDOM.createPortal(element, getElement(props.portalElement || defaultPortalElement)) : element;
      }

    }
  };
}

const emptyObj = {};



//methods for calculating position

// If possible aligns the start of the content with the start of the position.
// If this is not possible, positions the content as close as it can to that point
// whilst still within the bounds
export function alignStart (contentSize, boundsStart, boundsSize, positionStart, positionSize) {
  if(boundsStart === null || boundsStart === undefined || boundsSize === null || boundsSize === undefined) {
    return positionStart;
  }

  const boundsEnd = boundsStart + boundsSize;

  return positionStart + contentSize <= boundsEnd ? positionStart : boundsEnd - contentSize;
}

// If possible positions the start of the content with with start of the position.
// If this is not possible, positions the end of the content to align with the start
// of the position
export function afterOrBefore (contentSize, boundsStart, boundsSize, positionStart, positionSize) {
  if(boundsStart === null || boundsSize === undefined) {
    return positionStart + positionSize;
  }

  return positionStart + positionSize + contentSize <= boundsStart + boundsSize ? positionStart + positionSize : positionStart - contentSize;
}

export function startOrEnd (contentSize, boundsStart, boundsSize, positionStart, positionSize) {
  if(boundsStart === null || boundsSize === undefined) {
    return positionStart;
  }

  return positionStart + contentSize <= boundsStart + boundsSize ? positionStart : positionStart + positionSize - contentSize;
}

export function minWithinBounds(minStart, minEnd) {
  return (contentSize, boundsStart, boundsSize, positionStart, positionSize) => {
    if(boundsStart === null || boundsSize === undefined) {
      return positionStart;
    }


    if(minStart < 0) {
      if(boundsStart + minStart > positionStart) {
        return boundsStart + minStart;
      }
    } else {
      if(boundsStart + minStart - contentSize > positionStart) {
        return boundsStart + minStart - contentSize;
      }
    }

    const boundsEnd = boundsStart + boundsSize;

    if(minEnd < 0) {
      if(positionStart + contentSize + minEnd > boundsEnd) {
        return boundsEnd - minEnd - contentSize;
      }
    } else {
      if(positionStart + minEnd > boundsEnd) {
        return boundsEnd - minEnd;
      }
    }

    //TODO
    return positionStart;
  }
}


//Helpers methods
function getElement(element) {
  if(element instanceof Element) {
    return element;
  } else if(element instanceof Function) {
    return getElement(element());
  } else if(typeof(element) === 'string') {
    return document.querySelector(element);
  }

  return null;
}
