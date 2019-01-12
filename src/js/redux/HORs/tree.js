export const SET_NODE_IS_OPEN = 'tree.setIsNodeOpen';
export const SET_NODE_SELECTED = 'tree.setNodeSelected';

import modify from '@/helpers/object/modify';


const DEFAULT_STATE = {
  selectedNode: null,
  isNodeOpen: {}
};

export default function(id) {
  return function(state = DEFAULT_STATE, action) {
    if(action.id === id) {
      switch(action.type) {
        case SET_NODE_IS_OPEN:
          return modify(state, ['isNodeOpen', action.node], !!action.isOpen)
        case SET_NODE_SELECTED:
          return modify(state, 'selectedNode', action.node)
      }
    }

    return state;
  }
}

export function setIsNodeOpen(id, node, isOpen) {
  return {
    id,
    type: SET_NODE_IS_OPEN,
    node,
    isOpen
  };
}

export function setNodeSelected(id, node) {
  return {
    id,
    type: SET_NODE_SELECTED,
    node
  };
}
