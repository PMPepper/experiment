import {combineReducers} from 'redux';
//import * as reducers from './systemMap';

import assignValueReducer, {assignValue} from '@/redux/HORs/assignValue';
import * as RenderFlags from '@/components/game/renderFlags';


//defaults
const reduxId = 'systemMap';


const defaultSystemMapOptions = {
  display: {
    highlightColonies: true,
    highlightMinerals: true,
    bodies: {
      asteroid: {
        body: RenderFlags.ALL,
        label: RenderFlags.ALL,
        orbit: 0
      },
      moon: {
        body: RenderFlags.ALL,
        label: RenderFlags.ALL,
        orbit: RenderFlags.ALL
      },
      planet: {
        body: RenderFlags.ALL,
        label: RenderFlags.ALL,
        orbit: RenderFlags.ALL
      },
      dwarfPlanet: {
        body: RenderFlags.ALL,
        label: RenderFlags.ALL,
        orbit: RenderFlags.ALL
      },
      gasGiant: {
        body: RenderFlags.ALL,
        label: RenderFlags.ALL,
        orbit: RenderFlags.ALL
      },
      star: {
        body: RenderFlags.ALL,
        label: RenderFlags.ALL,
        orbit: RenderFlags.ALL
      },
    }
  },
  controls: {//16, 33, 34, 37, 38, 39, 40, 87, 68, 83, 65
    fast: 16,
    scrollUp: [38, 87],
    scrollRight: [39, 68],
    scrollDown: [40, 83],
    scrollLeft: [37, 65],
    zoomIn: [34],
    zoomOut: [33],
  },
  mouseEdgeScrolling: 20,
};


//The reducer
export default combineReducers({
  //...reducers,
  following: assignValueReducer(`${reduxId}.following`),
  options: assignValueReducer(`${reduxId}.options`, defaultSystemMapOptions),
});


//action creators
export function setFollowing(following) {
  return assignValue(`${reduxId}.following`, following);
}

export function setOptions(options) {
  return assignValue(`${reduxId}.options`, options);
}
