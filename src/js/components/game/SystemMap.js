import React from 'react';
import {compose} from 'recompose';

import defaultStyles from './systemMap.scss';
import SystemMapSVGRenderer from './SystemMapSVGRenderer';

import WindowSizeComponent from '@/HOCs/WindowSizeComponent';

import reduce from '@/helpers/object/reduce';

import {addItem, removeItem} from '@/modules/onFrameIterator';

//constants
const normalScrollSpeed = 200;//pixels per second
const fastScrollSpeed = 500;//pixels per second
const keysInUse = [16, 33, 34, 37, 38, 39, 40].reduce((obj, k) => {obj[k] = true; return obj;}, {});

const normalZoomSpeed = 2;
const fastZoomSpeed = 4;


class SystemMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      zoom: props.zoom,

    };

    this.tx = props.x;
    this.ty = props.y;
    this.tzoom = props.zoom;
    this.keysDown = {}

    addItem(this._onFrameUpdate);

    this._handlers = {
      onKeyDown: this._onKeyDown,
      onKeyUp: this._onKeyUp,
      onBlur: this._onBlur,
      onMouseDown: this._onMouseDown,
      onMouseMove: this._onMouseMove,
      onMouseLeave: this._onMouseLeave,
      onClick: this._onClick,
      onWheel: this._onWheel,
    };
  }

  componentWillUnmount() {
    removeItem(this._onFrameUpdate);

    this._endDragging();
  }

  _onFrameUpdate = (elapsedTime) => {

    const {keysDown, tx, ty, tzoom, props, state} = this;
    const {zoom, x, y} = state;

    const newState = {x, y, zoom};
    let hasScrolled = false;//has moved camera left/right/up/down, doesn't care about zooming < used to determine if we should stop following

    //Take keyboard input
    const scrollSpeed = ((keysDown[16] ? fastScrollSpeed : normalScrollSpeed) * elapsedTime) / zoom;
    const zoomSpeed = (keysDown[16] ? fastZoomSpeed : normalZoomSpeed);

    if(keysDown[39]) {//right
      this.tx = tx + scrollSpeed;
      hasScrolled = true;
    } else if(keysDown[37]) {//left
      this.tx = tx - scrollSpeed;
      hasScrolled = true;
    }

    if(keysDown[40]) {//down
      this.ty = ty + scrollSpeed;
      hasScrolled = true;
    } else if(keysDown[38]) {//up
      this.ty = ty - scrollSpeed;
      hasScrolled = true;
    }

    if(keysDown[34]) {//zoom in
      newState.zoom = zoom * Math.pow(zoomSpeed, elapsedTime);
    } else if(keysDown[33]) {//zoom out
      newState.zoom = zoom * Math.pow(1 / zoomSpeed, elapsedTime);
    }

    //follow current target
    if(props.following) {
      if(hasScrolled) {
        //user has scrolled, stop following current target
        props.setFollowing(null);
      } else {
        const followEntity = props.entities[props.following];

        //This is an entity that has a position, so can be followed...
        if(followEntity.position) {
          this.tx = followEntity.position.x;
          this.ty = followEntity.position.y;
        }
      }
    }

    //convert target x/y to real x/y with easing
    const easeFactor = 1/3;
    const easeThreshold = 1;

    newState.x = x + ((this.tx - x) * easeFactor);
    newState.y = y + ((this.ty - y) * easeFactor);

    if(Math.abs(newState.x - this.tx) < easeThreshold) {
      newState.x = this.tx;//easing finished
    }

    if(Math.abs(newState.y - this.ty) < easeThreshold) {
      newState.y = this.ty;//easing finished
    }

    //If any state changes, update the state
    if(newState.x !== state.x || newState.y !== state.y || newState.zoom !== state.zoom) {
      this.setState(newState);
    }
  }

  //event handlers
  _onKeyDown = (e) => {
    console.log(e.which);

    if(!keysInUse[e.which]) {
      return;
    }

    this.keysDown[e.which] = true;

    //Keys which do something have their default actions cancelled
    e.preventDefault();
  }

  _onKeyUp = (e) => {
    if(!keysInUse[e.which]) {
      return;
    }

    this.keysDown[e.which] = false;
  }

  _onBlur = () => {
    this.keysDown = {};
  }

  _onMouseDown = (e) => {
    //e.preventDefault();
    console.log(e.clientX, e.clientY);

    this._lastX = e.clientX;
    this._lastY = e.clientY;

    //DEV CODE
    const world = this.screenToWorld(e.clientX, e.clientY);
    const backToScreen = this.worldToScreen(world.x, world.y);

    console.log(`onMouseDown: screen(${e.clientX}, ${e.clientY}, world(${world.x}, ${world.y}), backToScreen(${backToScreen.x}, ${backToScreen.y})`);
    //END DEV CODE

    window.addEventListener('mousemove', this._onDragMove);
    window.addEventListener('mouseup', this._onDragUp);
  }

  _onDragMove = (e) => {
    e.preventDefault();

    //console.log(this.props, e.clientX - this._lastX, e.clientY - this._lastY);

    this._lastX = e.clientX;
    this._lastY = e.clientY;
  }

  _onDragUp = (e) => {
    e.preventDefault();

    this._endDragging()
  }

  _endDragging() {
    window.removeEventListener('mousemove', this._onDragMove);
    window.removeEventListener('mouseup', this._onDragUp);
  }

  _onMouseMove = (e) => {
    this._zoomX = e.clientX;
    this._zoomY = e.clientY;
  }

  _onMouseLeave = (e) => {
    this._zoomX = null;
    this._zoomY = null;
  }

  _onClick = (e) => {
    console.log('onClick: ', e.target);
    const target = e.target;

    if('entityId' in target.dataset) {
      const entityId = +target.dataset.entityId;

      this.props.setFollowing(entityId);
    }
  }

  _onWheel = (e) => {
    const wheelZoomSpeed = this.keysDown[16] ? 1.5 : 1.15;

    if(e.deltaY < 0) {
      this.setState({zoom: this.state.zoom * wheelZoomSpeed})
    } else if(e.deltaY > 0) {
      this.setState({zoom: this.state.zoom * (1/wheelZoomSpeed)})
    }
  }

  //public methods
  screenToWorld(screenX, screenY) {
    const {cx, cy, windowSize} = this.props;
    const {x, y, zoom} = this.state;

    screenX -= windowSize.width * cx;
    screenY -= windowSize.height * cy;

    //x -= (windowSize.width * cx) / zoom;
    //y -= (windowSize.height * cy) / zoom;

    return {
      x: x + (screenX / zoom),
      y: y + (screenY / zoom),
    };
  }

  worldToScreen(worldX, worldY) {
    const {cx, cy, windowSize} = this.props;
    const {x, y, zoom} = this.state;

    return {
      x: ((worldX - x) * zoom) + (windowSize.width * cx),
      y: ((worldY - y) * zoom) + (windowSize.height * cy)
    };
  }


  render() {
    const props = this.props;
    const {windowSize, entities, styles, cx, cy, options, renderComponent: RenderComponent} = props;
    let {x, y, zoom} = this.state;

    //center in window
    x -= (windowSize.width * cx) / zoom;
    y -= (windowSize.height * cy) / zoom;

    return <RenderComponent
      x={x}
      y={y}
      zoom={zoom}
      entities={entities}
      styles={styles}
      windowSize={windowSize}
      options={options}

      handlers={this._handlers}
    />
  }

  static defaultProps = {
    styles: defaultStyles,
    zoom: 1/1000000000,
    x: 0,
    y: 0,
    cx: 0.5,
    cy: 0.5,
    renderComponent: SystemMapSVGRenderer
  };
}


export default compose(
  WindowSizeComponent()
)(SystemMap);




/*
<canvas className={styles.systemMap} {...windowSize} ref={(ref) => {
  if(ref) {
    const ctx = ref.getContext('2d');

    ctx.fillStyle = 'rgb(0, 0, 20)';
    ctx.fillRect(0, 0, windowSize.width, windowSize.height);

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(400, 100, 50, 50);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(430, 130, 50, 50);
  }
}}></canvas>
*/

/*
<filter id="textShadow" height="130%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="1"/> <!-- stdDeviation is how much to blur -->
  {/*<feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
  <feComponentTransfer>
    <feFuncA type="linear" slope="1"/> <!-- slope is the opacity of the shadow -->
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/> <!-- this contains the offset blurred image -->
    <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
  </feMerge>
</filter>
*/
