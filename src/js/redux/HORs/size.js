export const RESIZE_TO = 'size.resizeTo';
export const RESIZE_BY = 'size.resizeBy';

const DEFAULT_STATE = {width: null, height: null};

export default function(id) {
  return function(state = DEFAULT_STATE, action) {
    if(action.id === id) {
      switch(action.type) {
        case RESIZE_TO:
          return {
            width: action.width,
            height: action.height,
          };
        case RESIZE_BY:
          return {
            width: state.width + action.width,
            height: state.height + action.height,
          };
      }
    }

    return state;
  }
}

export function resizeTo(id, width, height) {
  return {
    id,
    type: RESIZE_TO,
    width,
    height,
    time: Date.now(),
  };
}

export function resizeBy(id, width, height) {
  return {
    id,
    type: RESIZE_BY,
    width,
    height,
    time: Date.now(),
  };
}
