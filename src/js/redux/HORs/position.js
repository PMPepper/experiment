const MOVE_TO = 'position.moveTo';
const MOVE_BY = 'position.moveBy';

const DEFAULT_STATE = {x: 100, y: 100};

export default function(id) {
  return function(state = DEFAULT_STATE, action) {
    if(action.id === id) {
      switch(action.type) {
        case MOVE_TO:
          return {
            x: action.x,
            y: action.y,
          };
        case MOVE_BY:
          return {
            x: state.x + action.x,
            y: state.y + action.y,
          };
      }
    }

    return state;
  }
}

export function moveTo(id, x, y) {
  return {
    id,
    type: MOVE_TO,
    x,
    y
  };
}

export function moveBy(id, x, y) {
  return {
    id,
    type: MOVE_BY,
    x,
    y
  };
}
