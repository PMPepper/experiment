//TODO set limits on zoom/scroll

import React, {useRef, useCallback, useEffect, useMemo, useState} from 'react';
import objectpool from 'objectpool';
import {useSelector, useStore} from 'react-redux'

import defaultStyles from './systemMap.scss';
import * as EntityRenderers from './entityRenderers';
import SystemMapSVGRenderer from './SystemMapSVGRenderer';
//import SystemMapPixiRenderer from './SystemMapPixiRenderer';
import {startFadeRadius, fullyFadeRadius, startFadeOrbitRadius, fullyFadeOrbitRadius} from './GameConsts';

//Hooks
import useKeyboardState from '@/hooks/useKeyboardState';
import useWindowDimensions from '@/hooks/useWindowDimensions';

//Helpers
import reduce from '@/helpers/object/reduce';
import flatten from '@/helpers/array/flatten';
import combineProps from '@/helpers/react/combine-props';

//Other
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
const followExtraEaseTime = 0.5;


const SystemMap = React.memo(function SystemMap({
  systemId, setFollowing, cx, cy, styles, renderComponent: RenderComponent, onContextMenu,
  initialX, initialY, initialZoom,
  ...props
}) {
  //c/onsole.log('render SystemMap');

  const [keyboardStateProps, isKeyDown] = useKeyboardState(true);
  const windowSize = useWindowDimensions();
  const [t, setT] = useState();
  const setTRef = useRef();
  setTRef.current = setT;
  const hasReRenderedRef = useRef();
  hasReRenderedRef.current = true;

  //Redux
  const {following, options} = useSelector(state => state.systemMap);
  const factionId = useSelector(state => state.factionId);

  const store = useStore();
  const state = store.getState();
  const entities = state.entities.byId;
  const entityIds = state.entities.allIds;
  const colonies = state.entitiesByType.colony;

  //Refs
  const renderPrimitivesRef = useRef([]);
  const entityScreenPositionsRef = useRef([]);
  const stateRef = useRef({//init state ref
    mouseClientX: 0,
    mouseClientY: 0,
    isMouseDragging: false,
    mouseDownWorldCoords: null,
    dragMouseX: null,
    dragMouseY: null,

    lastFollowing: null,
    followingTime: 0,

    x: initialX,
    y: initialY,
    zoom: initialZoom,
    tx: initialX,
    ty: initialY,
    tzoom: initialZoom,
    cx,
    cy,
    isKeyDown,
    windowSize,
    options,
    following,
    setFollowing,
    store,
    lastTime: Date.now()
  })

  //-keep state ref updated
  stateRef.current.cx = cx;
  stateRef.current.cy = cy;
  stateRef.current.windowSize = windowSize;
  stateRef.current.options = options;
  stateRef.current.following = following;
  stateRef.current.setFollowing = setFollowing;
  stateRef.current.store = store;

  stateRef.current = onUpdateHandler(stateRef.current);

  let {x, y, zoom} = stateRef.current;

  const factionColoniesBySystemBody = useMemo(() => {
    return reduce(colonies, (output, colony) => {
      if(colony.systemId == systemId && colony.factionId == factionId) {
        output[colony.systemBodyId] = colony;
      }

      return output;
    }, {});
  }, [colonies, factionId, systemId])

  //center in window
  x -= (windowSize.width * cx) / zoom;
  y -= (windowSize.height * cy) / zoom;

  //return previous primitives to the pool
  const renderPrimitives = renderPrimitivesRef.current;

  renderPrimitives.forEach(primitive => {
    switch (primitive.t) {
      case 'circle':
        circlePool.release(primitive);
        break;
      case 'text':
        textPool.release(primitive);
        break;
      default:
        debugger;//shouldn't happen!
    }
  });

  //reset primitives length
  renderPrimitives.length = 0;

  //reset entityScreenPositions to pool
  const entityScreenPositions = entityScreenPositionsRef.current;

  entityScreenPositions.forEach(position => {positionsPool.release(position);});

  entityScreenPositions.length = 0;


  //Get new primitives + screen positions
  const renderableEntities = entityIds.reduce((output, id) => {
    const entity = entities[id];

    if(entity.render && entity.systemId == systemId) {
      output.push(entity);
    }

    return output;
  }, []);

  renderableEntities.forEach(entity => {
    const renderer = EntityRenderers[entity.render.type];

    renderer && renderer(renderPrimitives, entityScreenPositions, windowSize, x, y, zoom, entity, entities, factionColoniesBySystemBody, options.display);
  });

  //Callbacks
  const onUpdate = useCallback(elapsedTime => {
    if(hasReRenderedRef.current) {//if the map has re-rendered since the last time this was called
      hasReRenderedRef.current = false;
      setTRef.current(Date.now());//will force a re-render
    }
  }, []);

  const onMouseDown = useCallback(e => {
    const state = stateRef.current;

    state.dragMouseX = e.clientX;
    state.dragMouseY = e.clientY;
    state.mouseDownWorldCoords = screenToWorld(e.clientX, e.clientY, state);

    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragUp);
  }, []);

  const onDragMove = useCallback(e => {
    e.preventDefault();
    const state = stateRef.current;

    state.isMouseDragging = true;
    state.dragMouseX = e.clientX;
    state.dragMouseY = e.clientY;
  }, []);

  const onDragUp = useCallback(e => {
    e.preventDefault();
    const state = stateRef.current;
    state.isMouseDragging = false;

    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragUp);
  }, []);

  const onMouseMove = useCallback(e => {
    const state = stateRef.current;

    state.mouseClientX = e.clientX;
    state.mouseClientY = e.clientY;
  }, []);

  const onMouseLeave = useCallback(e => {
    const state = stateRef.current;

    state.mouseClientX = null;
    state.mouseClientY = null;
  }, []);

  const onWheel = useCallback(e => {
    const state = stateRef.current;

    const wheelZoomSpeed = state.isKeyDown(state.options.controls.fast) ? fastWheelZoomSpeed : normalWheelZoomSpeed;

    if(e.deltaY < 0) {
      state.tzoom *= wheelZoomSpeed;
    } else if(e.deltaY > 0) {
      state.tzoom *= (1 / wheelZoomSpeed);
    }
  }, []);

  const onClick = useCallback(e => {
    const target = e.target;

    const clickX = e.clientX;
    const clickY = e.clientY;

    const clickedEntity = entityScreenPositions.find(position => {
      if(position.r === 0) {
       return;
      }

      const dx = position.x - clickX;
      const dy = position.y - clickY;

      return (dx * dx) + (dy * dy) <= (position.r * position.r);
    })

    clickedEntity && setFollowing(clickedEntity.id);
  }, [setFollowing]);


  //Side effects
  useEffect(() => {
    addItem(onUpdate);

    return () => {
      removeItem(onUpdate);

      //tidy up event listeners
      window.removeEventListener('mouseup', onDragUp);
      window.removeEventListener('mousemove', onDragMove);
    }
  }, [])

  //Output rendered content
  return <RenderComponent
    {...combineProps(
      keyboardStateProps,
      props,
      {
        x,
        y,
        zoom,
        renderPrimitives,
        styles,
        windowSize,
        options,
        tabIndex: 0,
        onContextMenu: onContextMenu ? (e) => {
          onContextMenu(e, entityScreenPositions);
        } : null,

        onMouseDown,
        onMouseMove,
        onMouseLeave,
        onClick,
        onWheel,
      }
    )}
  />
})

SystemMap.defaultProps = {
  styles: defaultStyles,
  cx: 0.5,
  cy: 0.5,

  initialX: 0,
  initialY: 0,
  initialZoom: 1/1000000000,
  //renderComponent: SystemMapPixiRenderer,
  renderComponent: SystemMapSVGRenderer,
};

export default SystemMap;


function onUpdateHandler(state) {
  const now = Date.now();
  const elapsedTime = (now - state.lastTime) / 1000;

  const {
    mouseClientX, mouseClientY, isMouseDragging,
    tx, ty, tzoom,
    x, y, zoom,
    cx, cy,
    isKeyDown, windowSize, options,
    following, setFollowing, lastFollowing,

    mouseDownWorldCoords,
    dragMouseX, dragMouseY,

    store
  } = state;

  const newState = {
    ...state,
    lastTime: now
  };
  let hasScrolled = false;//has moved camera left/right/up/down, doesn't care about zooming < used to determine if we should stop following
  let isFollowing = false;

  //-keyboard zooming
  const zoomSpeed = (isKeyDown(options.controls.fast) ? fastZoomSpeed : normalZoomSpeed);//<TODO take into account elapsed time (frame rate)

  if(isKeyDown(options.controls.zoomIn)) {//zoom in
    newState.tzoom *= Math.pow(zoomSpeed, elapsedTime);
  } else if(isKeyDown(options.controls.zoomOut)) {//zoom out
    newState.tzoom *= Math.pow(1 / zoomSpeed, elapsedTime);
  }

  if(isMouseDragging) {
    if(following) {
      setFollowing(null);
    }

    //set target position to wherever places the mouseDownWorldCoords at the
    //current dragMouse screen position
    newState.tx = mouseDownWorldCoords.x -((dragMouseX - (windowSize.width * cx) ) / zoom);
    newState.ty = mouseDownWorldCoords.y -((dragMouseY - (windowSize.height * cy) ) / zoom);
  } else {
    //Take keyboard input scrolling
    const scrollSpeed = ((isKeyDown(options.controls.fast) ? fastScrollSpeed : normalScrollSpeed) * elapsedTime) / zoom;

    //-scrolling
    if(isKeyDown(options.controls.scrollRight) || (!following && mouseClientX !== null && (options.mouseEdgeScrolling + mouseClientX >= windowSize.width))) {//right
      newState.tx += scrollSpeed;
      hasScrolled = true;
    } else if(isKeyDown(options.controls.scrollLeft) || (!following && mouseClientX !== null && (mouseClientX < options.mouseEdgeScrolling))) {//left
      newState.tx -= scrollSpeed;
      hasScrolled = true;
    }

    if(isKeyDown(options.controls.scrollDown) || (!following && mouseClientY !== null && (options.mouseEdgeScrolling + mouseClientY >= windowSize.height))) {//down
      newState.ty += scrollSpeed;
      hasScrolled = true;
    } else if(isKeyDown(options.controls.scrollUp) || (!following && mouseClientY !== null && (mouseClientY < options.mouseEdgeScrolling))) {//up
      newState.ty -= scrollSpeed;
      hasScrolled = true;
    }

    //follow current target
    if(following) {
      if(hasScrolled) {
        //user has scrolled, stop following current target
        setFollowing(null);
        newState.lastFollowing = null;
        newState.followingTime = 0;
      } else {
        const state = store.getState();
        const followEntity = state.entities.byId[following];

        //This is an entity that has a position, so can be followed...
        if(followEntity.position) {
          newState.tx = followEntity.position.x;
          newState.ty = followEntity.position.y;
          isFollowing = true;
        }
      }
    }

    if(newState.lastFollowing) {
      if(isFollowing) {
        if(following === lastFollowing) {
          //still following the same thing
          newState.followingTime += elapsedTime;
        } else {
          //switched to following something new
          newState.lastFollowing = following;
          newState.followingTime = 0;
        }
      } else {
        //no longer following a thing
        newState.lastFollowing = null;
        newState.followingTime = 0;
      }
    } else if(isFollowing) {
      //am now following something
      newState.lastFollowing = following;
      newState.followingTime = 0;
    }
  }//end not currently mouse dragging

  //Ease zooming
  newState.zoom += ((tzoom - newState.zoom) * zoomEaseFactor);

  if(Math.abs(1 - (newState.zoom / tzoom)) < zoomEaseThreshold) {
    newState.zoom = tzoom;//zoom easing finished
  }

  //keep zooming centered
  if(!isFollowing && newState.zoom !== zoom) {
    if(mouseClientX !== null && mouseClientY !== null) {
      const mouseZoomWorldCurPos = screenToWorld(mouseClientX, mouseClientY, state);
      const mouseZoomWorldNewPos = screenToWorld(mouseClientX, mouseClientY, newState);

      const zoomDX = -(mouseZoomWorldNewPos.x - mouseZoomWorldCurPos.x);
      const zoomDY = -(mouseZoomWorldNewPos.y - mouseZoomWorldCurPos.y);

      newState.x += zoomDX;
      newState.y += zoomDY;

      newState.tx += zoomDX;
      newState.ty += zoomDY;
    }
  }

  //convert target x/y to real x/y with easing
  let easeFactor = baseScrollEaseFactor;
  const easeThreshold = 1 / state.zoom;
  const distanceFromTarget = Math.sqrt(Math.pow(newState.tx - newState.x, 2) + Math.pow(newState.ty - newState.y, 2));

  //if you're following something slowly reduce the easing to nothing so the
  //camera will catch up with it, even if it's moving quickly
  if(newState.followingTime > 0) {
    easeFactor += (newState.followingTime / followExtraEaseTime) * (1 - easeFactor);
  }

  //if easing not required
  if(easeFactor >= 1 || distanceFromTarget <= easeThreshold) {
    //just move to target
    newState.x = newState.tx;
    newState.y = newState.ty;
  } else {
    //apply easing
    newState.x += ((newState.tx - newState.x) * easeFactor);
    newState.y += ((newState.ty - newState.y) * easeFactor);
  }

  return newState;
}

//public methods
function screenToWorld(screenX, screenY, state, options) {
  const {cx, cy, windowSize} = state;

  const x = options && ('x' in options) ? options.x : state.x;
  const y = options && ('y' in options) ? options.y : state.y;
  const zoom = options && ('zoom' in options) ? options.zoom : state.zoom;

  screenX -= windowSize.width * cx;
  screenY -= windowSize.height * cy;

  return {
    x: x + (screenX / zoom),
    y: y + (screenY / zoom),
  };
}

function worldToScreen(worldX, worldY, state) {
  const {cx, cy, windowSize, x, y, zoom} = state;

  return {
    x: ((worldX - x) * zoom) + (windowSize.width * cx),
    y: ((worldY - y) * zoom) + (windowSize.height * cy)
  };
}


//TODO only works with circular orbits (all I have right now)
export function getEntityVisibleMaxZoom(entity) {
  const parent = entity.movement && entity.movement.orbitingId;
  let entityRadius = 0;

  if(entity.type === 'systemBody') {
    entityRadius = entity.systemBody.radius;
  } else if(entity.type === 'shipyard') {
    entityRadius = entity.shipyard.radius;
  }

  //opacity = (systemBodyRadius - fullyFadeRadius) / (startFadeRadius - fullyFadeRadius);
  const radiusMaxZoom = startFadeRadius / entityRadius;

  //if you're orbiting something, check the max zoom before this starts to fade
  if(parent) {
    const orbitRadius = entity.movement.radius;

    const orbitRadiusMaxZoom = (startFadeOrbitRadius / orbitRadius) * 1.2;

    return Math.max(orbitRadiusMaxZoom, radiusMaxZoom);
  }

  return radiusMaxZoom;
}



//define object pools + generators
const circlePool = objectpool.generate({t: 'circle', id: null, x: 0, y: 0, r: 0, opacity: 0, type: null, subType: null}, {count: 50, regenerate: 1});
const textPool = objectpool.generate({t: 'text', text: null, id: null, x: 0, y: 0, opacity: 0, type: null, subType: null}, {count: 50, regenerate: 1});

export function circle(id, x, y, r, opacity, type, subType) {
  const circle = circlePool.get();

  circle.id = id;
  circle.x = x;
  circle.y = y;
  circle.r = r;
  circle.opacity = opacity;
  circle.type = type;
  circle.subType = subType;

  return circle;
}

export function text(id, textVal, x, y, opacity, type, subType) {
  const text = textPool.get();

  text.id = id;
  text.text = textVal;
  text.x = x;
  text.y = y;
  text.opacity = opacity;
  text.type = type;
  text.subType = subType;

  return text;
}

//entity position pool
const positionsPool = objectpool.generate(
  {id: null, x: 0, y: 0, r: 0},
  {
    count: 50,
    regenerate: 1
  }
);

export function position(id, x, y, r) {
  const position = positionsPool.get();

  position.id = id;
  position.x = x;
  position.y = y;
  position.r = r;

  return position;
}
