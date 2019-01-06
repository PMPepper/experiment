import {combineReducers} from 'redux';
//import * as reducers from './systemMap';

import assignValueReducer, {assignValue} from '@/redux/HORs/assignValue';
import * as RenderFlags from '@/components/game/renderFlags';


//defaults
const reduxId = 'systemMap';


const defaultSystemMapDisplayOptions = {
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
};


//The reducer
export default combineReducers({
  //...reducers,
  following: assignValueReducer(`${reduxId}.following`),
  options: assignValueReducer(`${reduxId}.options`, defaultSystemMapDisplayOptions),
});


//action creators
export function setFollowing(following) {
  return assignValue(`${reduxId}.following`, following);
}

export function setOptions(options) {
  return assignValue(`${reduxId}.options`, options);
}
