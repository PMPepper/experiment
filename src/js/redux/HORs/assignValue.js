export default function(actionName, defaultState = null) {
  return function assignVale(state = defaultState, action) {
    if(action.type === ASSIGN && action.name === actionName) {
      return action.value
    }

    return state;
  }
}

export const ASSIGN = 'assignValue.assign';

export function assignValue(name, value) {
  return {
    type: ASSIGN,
    name,
    value
  };
}
