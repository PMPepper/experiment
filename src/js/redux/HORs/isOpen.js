export const OPEN = 'isOpen.open';
export const CLOSE = 'isOpen.cose';

const DEFAULT_STATE = false;

export default function(id) {
  return function(state = DEFAULT_STATE, action) {
    if(action.id === id) {
      switch(action.type) {
        case OPEN:
          return true;
        case CLOSE:
          return false;
      }
    }

    return state;
  }
}

export function open(id) {
  return {
    id,
    type: OPEN,
    time: Date.now(),
  };
}

export function close(id) {
  return {
    id,
    type: CLOSE,
    time: Date.now(),
  };
}
