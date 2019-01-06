import React from 'react';
import {compose} from 'recompose';

import defaultStyles from './systemMap.scss';
import SystemMapSVGRenderer from './SystemMapSVGRenderer';

import WindowSizeComponent from '@/HOCs/WindowSizeComponent';
import KeyboardControlsComponent from '@/HOCs/KeyboardControlsComponent';

import reduce from '@/helpers/object/reduce';
import flatten from '@/helpers/array/flatten';

import {addItem, removeItem} from '@/modules/onFrameIterator';

//constants
const normalScrollSpeed = 200;//pixels per second
const fastScrollSpeed = 500;//pixels per second

const baseScrollEaseFactor = 1/3;

const normalZoomSpeed = 2;
const fastZoomSpeed = 4;

const normalWheelZoomSpeed = 1.15;
const fastWheelZoomSpeed = 1.5;

const zoomEaseFactor = 1/3;
const zoomEaseThreshold = 0.0001;


//time (in seconds) over which easing gets ramped from base to 1 when following a position
//this is to catch up with fast objects
const followExtraEaseTime = 3;


class SystemMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      zoom: props.zoom
    };

    this.tx = props.x;
    this.ty = props.y;
    this.tzoom = props.zoom;
    this.followingTime = 0;
    this.lastFollowing = null;
    this.isMouseDragging = false;

    addItem(this._onFrameUpdate);

    this._elementProps = {
      onKeyDown: props.onKeyDown,
      onKeyUp: props.onKeyUp,
      onBlur: props.onBlur,
      tabIndex: 0,
      onMouseDown: this._onMouseDown,
      onMouseMove: this._onMouseMove,
      onMouseLeave: this._onMouseLeave,
      onClick: this._onClick,
      onWheel: this._onWheel,
    };

    props.setActiveKeys(flatten(Object.values(props.options.controls)));
  }

  _onFrameUpdate = (elapsedTime) => {
    const {props, state, mouseClientX, mouseClientY, isMouseDragging} = this;
    const {isKeyDown, options} = props;

    const newState = {x: state.x, y: state.y, zoom: state.zoom};
    let hasScrolled = false;//has moved camera left/right/up/down, doesn't care about zooming < used to determine if we should stop following
    let isFollowing = false;

    //-keyboard zooming
    const zoomSpeed = (isKeyDown(options.controls.fast) ? fastZoomSpeed : normalZoomSpeed);//<TODO take into account elapsed time (frame rate)

    if(isKeyDown(options.controls.zoomIn)) {//zoom in
      this.tzoom *= Math.pow(zoomSpeed, elapsedTime);
    } else if(isKeyDown(options.controls.zoomOut)) {//zoom out
      this.tzoom *= Math.pow(1 / zoomSpeed, elapsedTime);
    }

    if(isMouseDragging) {
      if(props.following) {
        props.setFollowing(null);
      }

      //set target position to wherever places the mouseDownWorldCoords at the
      //current dragMouse screen position
      this.tx = this.mouseDownWorldCoords.x -((this.dragMouseX - (props.windowSize.width * props.cx) ) / state.zoom);
      this.ty = this.mouseDownWorldCoords.y -((this.dragMouseY - (props.windowSize.height * props.cy) ) / state.zoom);
    } else {
      //Take keyboard input scrolling
      const scrollSpeed = ((isKeyDown(options.controls.fast) ? fastScrollSpeed : normalScrollSpeed) * elapsedTime) / state.zoom;

      //-scrolling
      if(isKeyDown(options.controls.scrollRight)) {//right
        this.tx += scrollSpeed;
        hasScrolled = true;
      } else if(isKeyDown(options.controls.scrollLeft)) {//left
        this.tx -= scrollSpeed;
        hasScrolled = true;
      }

      if(isKeyDown(options.controls.scrollDown)) {//down
        this.ty += scrollSpeed;
        hasScrolled = true;
      } else if(isKeyDown(options.controls.scrollUp)) {//up
        this.ty -= scrollSpeed;
        hasScrolled = true;
      }

      //follow current target
      if(props.following) {
        if(hasScrolled) {
          //user has scrolled, stop following current target
          props.setFollowing(null);
          this.lastFollowing = null;
          this.followingTime = 0;
        } else {
          const followEntity = props.entities[props.following];

          //This is an entity that has a position, so can be followed...
          if(followEntity.position) {
            this.tx = followEntity.position.x;
            this.ty = followEntity.position.y;
            isFollowing = true;
          }
        }
      }

      if(this.lastFollowing) {
        if(isFollowing) {
          if(props.following === this.lastFollowing) {
            //still following the same thing
            this.followingTime += elapsedTime;
          } else {
            //switched to following something new
            this.lastFollowing = props.following;
            this.followingTime = 0;
          }
        } else {
          //no longer following a thing
          this.lastFollowing = null;
          this.followingTime = 0;
        }
      } else if(isFollowing) {
        //am now following something
        this.lastFollowing = props.following;
        this.followingTime = 0;
      }
    }//end not currently mouse dragging

    //Ease zooming
    newState.zoom += ((this.tzoom - newState.zoom) * zoomEaseFactor);

    if(Math.abs(1 - (newState.zoom / this.tzoom)) < zoomEaseThreshold) {
      newState.zoom = this.tzoom;//zoom easing finished
    }

    //keep zooming centered
    if(!isFollowing && newState.zoom !== state.zoom) {
      if(mouseClientX !== null && mouseClientY !== null) {
        const mouseZoomWorldCurPos = this.screenToWorld(mouseClientX, mouseClientY);
        const mouseZoomWorldNewPos = this.screenToWorld(mouseClientX, mouseClientY, {zoom: newState.zoom});

        const zoomDX = -(mouseZoomWorldNewPos.x - mouseZoomWorldCurPos.x);
        const zoomDY = -(mouseZoomWorldNewPos.y - mouseZoomWorldCurPos.y);

        newState.x += zoomDX;
        newState.y += zoomDY;

        this.tx += zoomDX;
        this.ty += zoomDY;
      }
    }

    //convert target x/y to real x/y with easing
    let easeFactor = baseScrollEaseFactor;
    const easeThreshold = 1 / state.zoom;
    const distanceFromTarget = Math.sqrt(Math.pow(this.tx - newState.x, 2) + Math.pow(this.ty - newState.y, 2));

    //if you're following something slowly reduce the easing to nothing so the
    //camera will catch up with it, even if it's moving quickly
    if(this.followingTime > 0) {
      easeFactor += (this.followingTime / followExtraEaseTime) * (1 - easeFactor);
    }

    //if easing not required
    if(easeFactor >= 1 || distanceFromTarget <= easeThreshold) {
      //just move to target
      newState.x = this.tx;
      newState.y = this.ty;
    } else {
      //apply easing
      newState.x += ((this.tx - newState.x) * easeFactor);
      newState.y += ((this.ty - newState.y) * easeFactor);
    }

    //If any state changes, update the state
    if(newState.x !== state.x || newState.y !== state.y || newState.zoom !== state.zoom) {
      this.setState(newState);
    }
  }

  //event handlers
  _onMouseDown = (e) => {
    this.dragMouseX = e.clientX;
    this.dragMouseY = e.clientY;

    this.mouseDownWorldCoords = this.screenToWorld(e.clientX, e.clientY);

    window.addEventListener('mousemove', this._onDragMove);
    window.addEventListener('mouseup', this._onDragUp);
  }

  _onDragMove = (e) => {
    e.preventDefault();

    this.isMouseDragging = true;

    this.dragMouseX = e.clientX;
    this.dragMouseY = e.clientY;
  }

  _onDragUp = (e) => {
    e.preventDefault();

    this._endDragging()
  }

  _endDragging() {
    this.isMouseDragging = false;

    window.removeEventListener('mousemove', this._onDragMove);
    window.removeEventListener('mouseup', this._onDragUp);
  }

  _onMouseMove = (e) => {
    this.mouseClientX = e.clientX;
    this.mouseClientY = e.clientY;
  }

  _onMouseLeave = (e) => {
    this.mouseClientX = null;
    this.mouseClientY = null;
  }

  _onClick = (e) => {
    const target = e.target;

    if('entityId' in target.dataset) {
      const entityId = +target.dataset.entityId;

      this.props.setFollowing(entityId);
    }
  }

  _onWheel = (e) => {
    const wheelZoomSpeed = this.props.isKeyDown(this.props.options.controls.fast) ? fastWheelZoomSpeed : normalWheelZoomSpeed;

    if(e.deltaY < 0) {
      this.tzoom *= wheelZoomSpeed;
    } else if(e.deltaY > 0) {
      this.tzoom *= (1 / wheelZoomSpeed);
    }
  }

  //public methods
  screenToWorld(screenX, screenY, options) {
    const {cx, cy, windowSize} = this.props;
    const x = options && ('x' in options) ? options.x : this.state.x;
    const y = options && ('y' in options) ? options.y : this.state.y;
    const zoom = options && ('zoom' in options) ? options.zoom : this.state.zoom;

    screenX -= windowSize.width * cx;
    screenY -= windowSize.height * cy;

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

  //React lifecycle methods

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
      options={options.display}

      elementProps={this._elementProps}
    />
  }

  componentDidUpdate(prevProps) {
    const props = this.props;

    if(props.setActiveKeys !== prevProps.setActiveKeys || props.options !== prevProps.options) {
      props.setActiveKeys(flatten(Object.keys(props.options.controls)));
    }
  }

  componentWillUnmount() {
    removeItem(this._onFrameUpdate);

    this._endDragging();
  }

  //static props
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
  WindowSizeComponent(),
  KeyboardControlsComponent()
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
