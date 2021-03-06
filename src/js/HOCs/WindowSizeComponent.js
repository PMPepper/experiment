import React from 'react';
import {getDisplayName} from 'recompose';


export default function WindowSizeComponent({
  mapProps = (props, windowSize) => ({...props, windowSize})
} = {}) {
  return (PresentationalComponent) => {
    return class extends React.Component {
      constructor(props) {
        super(props);

        addItem(this._updateWindowBounds);
      }

      componentWillUnmount() {
        removeItem(this._updateWindowBounds);
      }

      _updateWindowBounds = () => {
        this.forceUpdate();
      }

      render() {
        return <PresentationalComponent {...mapProps(this.props, windowSize)} />
      }

      static displayName = `WindowSizeComponent(${getDisplayName(PresentationalComponent)})`;
    }
  }
}

//
let windowSize;


const items = [];

function addItem(item) {
  items.push(item);

  if(items.length === 1) {
    start();
  }
}

function removeItem(item) {
  items.splice(items.indexOf(item), 1);

  if(items.length === 0) {
    stop();
  }
}

//Gunna need to do this with a update frame handler, because the resize event is useless.
function start() {
  window.addEventListener('resize', onWindowResized);

  //get what the window bounds are right now
  updateBounds();
}

function stop() {
  window.removeEventListener('resize', onWindowResized);
}

function updateBounds() {
  windowSize = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }
};

function onWindowResized() {
  //window resized, so get new bounds
  updateBounds();

  //update all items with new bounds
  for(let i = 0, l = items.length; i < l; ++i) {
    items[i]();
  }
}
