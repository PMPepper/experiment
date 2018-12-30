import React from 'react';
import {getDisplayName} from 'recompose';

//allow updates if window height changes even if has no effect on div size?
//I know there was a reason for this, but I can't recall what it was

export default function ResponsiveComponent(
  checkSize = null,
  {
    mapProps = (props, state, getRef) => ({...props, ...state, getRef})
  } = {}
) {
  return (PresentationalComponent) => {
    return class extends React.Component {
      state = {};
      _lastSizeProps = {};
      _isMounted = false;
      _ref = null;

      constructor(props) {
        super(props);

        this._isMounted = true;
        addComponent(this);
      }

      componentDidMount() {
        this._updateSize();

        //live-dev-server has not applied styles at point of component mounting, so
        //size checks do not work. Slight delay makes this work
        if(process.env.NODE_ENV !== 'production') {
          setTimeout(() => {this._updateSize()}, 0)
        }
      }

      componentWillUnmount() {
        removeComponent(this);

        this._isMounted = false;
      }

      _getRef = (elem) => {
        this.props.getRef && this.props.getRef(ref);

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
        const lastSizeProps = this._lastSizeProps

        if(!elem || !document.body.contains(elem) || !elem.offsetWidth) {
          return;
        }

        //If any sizes have changed, re-run check size function & update state
        if(
          elem.offsetWidth != lastSizeProps.outerWidth ||
          elem.offsetHeight != lastSizeProps.outerHeight ||
          elem.clientWidth != lastSizeProps.innerWidth ||
          elem.clientHeight != lastSizeProps.innerHeight ||
          elem.scrollWidth != lastSizeProps.scrollWidth ||
          elem.scrollHeight != lastSizeProps.scrollHeight
        ) {
          const sizeProps = {
            outerWidth: elem.offsetWidth,
            outerHeight: elem.offsetHeight,
            innerWidth: elem.clientWidth,
            innerHeight: elem.clientHeight,
            scrollWidth: elem.scrollWidth,
            scrollHeight: elem.scrollHeight,
          }

          //Record new values
          this.setState(checkSize(sizeProps, this._lastSizeProps, state, this.props));

          //Update last size props
          this._lastSizeProps = sizeProps;
        }
      }

      componentDidUpdate() {
        this._updateSize();//check element sizes after rendering
      }

      render() {
        const props = this.props;

        return <PresentationalComponent {...mapProps(props, this.state, this._getRef)}>{props.children}</PresentationalComponent>;
      }

      static displayName = `ResponsiveComponent(${getDisplayName(PresentationalComponent)})`;
    }
  }
}

//Internal helper methods
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
let debounceDelay = 0;//optional debounce delay - will help performance on complex app

function onResize(e) {
  if(resizedTId !== null) {
    clearTimeout(resizedTId);
    resizedTId = null;
  }

  if(debounceDelay > 0) {
    resizedTId = setTimeout(doResize, debounceDelay*1000);
  } else {
    doResize();
  }
}

function doResize() {
  resizedTId = null;

  components.forEach((component) => {
    component._updateSize();
  })
}

//checkSize factory methods
export function makeCheckSizeWidthFunc(prop, minWidth = 0) {
  return ({outerWidth, scrollWidth}, {outerWidth: lastOuterWidth, scrollWidth: lastScrollWidth}, lastState) => {
    //console.log(outerWidth, scrollWidth, lastOuterWidth, lastScrollWidth, lastState);
    if(outerWidth === lastOuterWidth && scrollWidth === lastScrollWidth) {
      //console.log('keep using previous');
      return lastState;//If width of the component hasn't changed, retain current mode
    }

    if(scrollWidth > outerWidth) {
      //console.log('use alternative');
      return {[prop]: true};
    } else if(lastScrollWidth > lastOuterWidth && outerWidth === lastOuterWidth) {
      //console.log('keep using alternative', outerWidth, scrollWidth, lastState);
      return {[prop]: true};//had to switch to responsive component because regular one didn't fit
    }

    return {[prop]: outerWidth < minWidth};
  }
}
