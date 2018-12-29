//NOT SURE I WANT/NEED THIS
//TODO re-implement as component that passes props to children!

import React from 'react';
import ReactDOM from 'react-dom';
import memoize from 'memoize-one';
import {compose, getDisplayName} from 'recompose';

import {addItem, removeItem, isItemAdded} from  '@/modules/onFrameIterator';


/*Needs:

-the contents (as an element, so it can measure it's size)
-The bounds (optional?)
-where it should be positioned (x/y + width/height OR top right bottom left?)

*/

//The component
export default function PositionedItemComponent({
  defaultPortalElement = document.body,
  usePortal = true,
  xPosRule = alignStart,
  yPosRule = afterOrBefore,
  mapProps = ({portalElement,
      boundsX, boundsY, boundsWidth, boundsHeight,
      positionX, positionY, positionWidth, positionHeight,
      positionedItemZIndex,
      ...rest
    },
    state,
    style
  ) => ({...rest, style})
} = {}) {
  return (PresentationalComponent) => {
    return class extends React.Component {
      static displayName = `PositionedItemComponent${getDisplayName(PresentationalComponent)}`;

      _positionedItem = null;

      constructor(props) {
        super(props);

        this.state = {
          positionedItemContentWidth: 0,
          positionedItemContentHeight: 0
        };

        addItem(this.updateContentSize);
      }

      //tidy up on unmount
      componentWillUnmount() {
        removeItem(this.updateContentSize);
      }

      //As long as you are mounted, update the size
      updateContentSize = () => {
        const positionedItemElement = this._positionedItem;

        if(positionedItemElement) {
          const positionedItemContentWidth = positionedItemElement.clientWidth;
          const positionedItemContentHeight = positionedItemElement.clientHeight;

          if(this.state.positionedItemContentWidth !== positionedItemContentWidth || this.state.positionedItemContentHeight !== positionedItemContentHeight) {
            this.setState({positionedItemContentWidth, positionedItemContentHeight});
          }
        } else {
          this.setState({positionedItemContentWidth: 0, positionedItemContentHeight: 0});
        }
      }

      //record the ref to the element that is being positioned
      setPositionedItemElement = (positionedItemElement) => {
        this._positionedItem = positionedItemElement;
      }

      //calculate where the element should be positioned
      getPositionStyles = memoize((positionedItemContentWidth, positionedItemContentHeight, boundsX, boundsY, boundsWidth, boundsHeight, positionX, positionY, positionWidth, positionHeight, positionedItemZIndex) => {
        return {
          position: 'fixed',
          zIndex: positionedItemZIndex,
          left: `${xPosRule(positionedItemContentWidth, boundsX, boundsWidth, positionX, positionWidth)}px`,
          top: `${yPosRule(positionedItemContentHeight, boundsY, boundsHeight, positionY, positionHeight)}px`,
        };
      })


      render() {
        const props = this.props;
        const state = this.state;

        //calculate the position
        const style = this.getPositionStyles(state.positionedItemContentWidth, state.positionedItemContentHeight, props.boundsX, props.boundsY, props.boundsWidth, props.boundsHeight, props.positionX, props.positionY, props.positionWidth || 0, props.positionHeight || 0, props.positionedItemZIndex || 10);

        //map the props
        const mappedProps = mapProps(props, state, style);

        //add the ref to the props
        mappedProps[typeof(PresentationalComponent) === 'string' ? 'ref' : 'getRef'] = this.setPositionedItemElement;

        //create the PresentationalComponent element
        const element = <PresentationalComponent {...mappedProps} />;

        //if needed create portal
        return usePortal ? ReactDOM.createPortal(element, getElement(props.portalElement || defaultPortalElement)) : element;
      }

    }
  };
}



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
