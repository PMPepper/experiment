import React from 'react';
import {getDisplayName} from 'recompose';

//allow updates if window height changes even if has no effect on div size?
//I know there was a reason for this, but I can't recall what it was

export default function MonitorSize({
  //resizeWithWindowVertical = false,
  //resizeWithWindowHorizontal = false,
  /*mergeProps = (ownProps, addedProps) => {
    return {...ownProps, ...addedProps};
  },*/
  mapProps = (props, state, getRef) => (props)
} = {}) {

  return (PresentationalComponent) => {
    return class extends React.Component {
      state = {};
      //_lastWindowWidth = 0;
      //_lastWindowHeight = 0;
      _isMounted = false;
      _ref = null;

      constructor(props) {
        super(props);

        this._isMounted = true;
        addComponent(this);
      }

      componentWillUnmount() {
        removeComponent(this);

        this._isMounted = false;
      }

      _getRef = (elem) => {
        if(elem && elem !== this._elem) {
          this._elem = elem;

          this._updateSize();
        }
      }

      _updateSize() {
        if(!this._isMounted) {
          return;
        }

        const elem = this._elem;
        const state = this.state;

        if(!elem || !document.body.contains(elem) || !elem.offsetWidth) {
          //this._lastWindowWidth = 0;
          //this._lastWindowHeight = 0;

          return;
        }

        if(
          elem.offsetWidth != state.outerWidth ||
          elem.offsetHeight != state.outerHeight ||
          elem.clientWidth != state.innerWidth ||
          elem.clientHeight != state.innerHeight ||
          elem.scrollWidth != state.scrollWidth ||
          elem.scrollHeight != state.scrollHeight
          //resizeWithWindowVertical && (window.innerHeight != this._lastWindowHeight) ||
          //resizeWithWindowHorizontal && (window.innerWidth != this._lastWindowWidth)
        ) {
          this.setState({
            outerWidth: elem.offsetWidth,
            outerHeight: elem.offsetHeight,
            innerWidth: elem.clientWidth,
            innerHeight: elem.clientHeight,
            scrollWidth: elem.scrollWidth,
            scrollHeight: elem.scrollHeight,
          });
        }

        //this._lastWindowWidth = window.innerWidth;
        //this._lastWindowHeight = window.innerHeight;
      }

      componentDidUpdate() {
        this._updateSize();//check element sizes after rendering
      }

      render(props) {
        return <PresentationalComponent {...mapProps(props, this.state, this._getRef)}>{this.props.children}</PresentationalComponent>;
      }

      static displayName = `MonitorSize(${getDisplayName(PresentationalComponent)})`;
    }
  }
}


const components = [];

function addComponent(component) {
  if(!component) {
    return;
  }

  if(components.length == 0) {
    addListeners();
  }

  components.push(component);
}

function removeComponent(component) {
  const index = components.indexOf(component);

  if(index === -1) {
    return;
  }

  components.splice(index, 1);

  if(components.length == 0) {
    clearListeners();
  }
}

function addListeners() {
  window.addEventListener('resize', onResize);
}

function clearListeners() {
  window.removeEventListener('resize', onResize);
}


let resizedTId = null;
let debounceDelay = 0.4;

function onResize(e) {
  if(resizedTId !== null) {
    clearTimeout(resizedTId);
    resizedTId = null;
  }

  resizedTId = setTimeout(doResize, debounceDelay*1000);
}

function doResize() {
  resizedTId = null;

  components.forEach((component) => {
    component._updateSize();
  })
}
