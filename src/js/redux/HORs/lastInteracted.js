export const INTERACT = 'lastInteraction.interact';


const DEFAULT_STATE = 0;

export default function(id, others) {
  return function(state = DEFAULT_STATE, action) {
    if(action.id === id) {
      if(action.type === INTERACT) {
        return Math.max(state, action.time);
      } else if(others && others.includes(action.type)) {
        return Math.max(state, action.time);
      }
    }

    return state;
  }
}

export function interact(id) {
  return {
    id,
    type: INTERACT,
    time: Date.now()
  };
}
