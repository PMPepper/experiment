export default function(actionName, defaultState = null, additional = null) {
  return function assignVale(state = defaultState, action) {
    if(action.type === actionName) {
      return action.value
    }

    if(additional && additional[action.type]) {
      return additional[action.type](state, action);
    }

    return state;
  }
}

export function assignValue(name, value) {
  return {
    type: name,
    value
  };
}
