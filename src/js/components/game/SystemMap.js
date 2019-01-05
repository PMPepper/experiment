import React from 'react';
import {compose} from 'recompose';

import defaultStyles from './systemMap.scss';

import * as EntityRenderers from './entityRenderers';

import WindowSizeComponent from '@/HOCs/WindowSizeComponent';

import reduce from '@/helpers/object/reduce';

import {addItem, removeItem} from '@/modules/onFrameIterator';

//constants
const normalScrollSpeed = 200;//pixels per second
const fastScrollSpeed = 500;//pixels per second
const keysInUse = [16, 33, 34, 37, 38, 39, 40].reduce((obj, k) => {obj[k] = true; return obj;}, {});

const normalZoomSpeed = 1.2;
const fastZoomSpeed = 2;


class SystemMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      zoom: props.zoom,
      keysDown: {}
    };

    addItem(this._onFrameUpdate);
  }

  componentWillUnmount() {
    removeItem(this._onFrameUpdate);
  }

  _onFrameUpdate = (elapsedTime) => {
    //console.log('elapsedTime: ', elapsedTime);
    const state = this.state;
    const {keysDown, zoom, x, y} = state;
    const newState = {};
    let hasChanged = false;

    const scrollSpeed = ((keysDown[16] ? fastScrollSpeed : normalScrollSpeed) * elapsedTime) / zoom;
    const zoomSpeed = (keysDown[16] ? fastZoomSpeed : normalZoomSpeed);

    if(keysDown[39]) {//right
      newState.x = x + scrollSpeed;
      hasChanged = true;
    } else if(keysDown[37]) {//left
      newState.x = x - scrollSpeed;
      hasChanged = true;
    }

    if(keysDown[40]) {//right
      newState.y = y + scrollSpeed;
      hasChanged = true;
    } else if(keysDown[38]) {//left
      newState.y = y - scrollSpeed;
      hasChanged = true;
    }

    if(keysDown[34]) {//zoom
      newState.zoom = zoom * Math.pow(zoomSpeed, elapsedTime);
      hasChanged = true;
    } else if(keysDown[33]) {//zoom
      newState.zoom = zoom * Math.pow(1 / zoomSpeed, elapsedTime);
      hasChanged = true;
    }

    if(hasChanged) {
      this.setState(newState);
    }
  }

  _onKeyDown = (e) => {
    console.log(e.which);

    if(!keysInUse[e.which]) {
      return;
    }

    this.setState({keysDown: {
      ...this.state.keysDown,
      [e.which]: true
    }});

    //Keys which do something have their default actions cancelled
    e.preventDefault();
  }

  _onKeyUp = (e) => {
    if(!keysInUse[e.which]) {
      return;
    }

    this.setState({keysDown: {
      ...this.state.keysDown,
      [e.which]: false
    }});
  }

  _onBlur = () => {
    this.setState({keysDown: {}});
  }

  render() {
    const props = this.props;
    const {windowSize, entities, styles, cx, cy} = props;
    let {x, y, zoom} = this.state;

    x -= (windowSize.width * cx) / zoom;
    y -= (windowSize.height * cy) / zoom;

    const renderableEntities = reduce(entities, (output, entity) => {
      if(entity.render) {
        output.push(entity);
      }

      return output
    }, [])//[];//server.getEntitiesByIds(server.getCachedEntities('renderable'))

    return <div className={styles.systemMapWrapper} tabIndex="0" onKeyDown={this._onKeyDown} onKeyUp={this._onKeyUp} onBlur={this._onBlur}><svg className={styles.systemMap}>
      <filter id="textShadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/> {/*<!-- stdDeviation is how much to blur -->*/}
        {/*<feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->*/}
        <feComponentTransfer>
          <feFuncA type="linear" slope="1"/> {/*<!-- slope is the opacity of the shadow -->*/}
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/> {/*<!-- this contains the offset blurred image -->*/}
          <feMergeNode in="SourceGraphic"/> {/*<!-- this contains the element that the filter is applied to -->*/}
        </feMerge>
      </filter>
      {renderableEntities.map(entity => {
        const Renderer = EntityRenderers[entity.render.type];

        return Renderer && <Renderer {...props} x={x} y={y} zoom={zoom} entity={entity} key={entity.id} />;
      })}
    </svg></div>
  }

  static defaultProps = {
    styles: defaultStyles,
    zoom: 1/1000000000,
    x: 0,
    y: 0,
    cx: 0.5,
    cy: 0.5
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
