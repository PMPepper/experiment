import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//Internal
import Window from './Window';

//Helpers
import resolvePath from '@/helpers/object/resolve-path';

//Reducers
import {moveBy} from '@/redux/HORs/position';
import {close} from '@/redux/HORs/isOpen';


//The component
export default compose(
  connect(
    (state, {reduxPath}) => {
      const windowState = resolvePath(state, reduxPath);

      return {
        position: windowState.position,
        size: windowState.size,
        isOpen: windowState.isOpen
      };
    },
    {
      moveBy,
      close
    },
    (stateProps, dispatchProps, ownProps) => {
      return {
        ...ownProps,
        ...stateProps,
        ...bindReactHandlers(dispatchProps, ownProps.reduxPath, {moveBy: 'moveBy', close: 'onRequestClose'})
      }
    }
  )
)(({isOpen, reduxPath, ...props}) => {
  return isOpen && <Window {...props} />
});

//Internal handlers
function bindReactHandlers(dispatchProps, reduxPath, handlers) {
  return Object.keys(handlers).reduce((bound, handler) => {
    bound[handlers[handler]] = (...args) => {
      dispatchProps[handler].apply(null, [reduxPath, ...args]);
    }

    return bound;
  }, {})
}
