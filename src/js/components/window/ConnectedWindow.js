import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import Window from './Window';

//Helpers
import resolvePath from '@/helpers/object/resolve-path';

//reducers
import {moveBy} from '@/redux/HORs/position';

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
      moveBy
    },
    (stateProps, dispatchProps, ownProps) => {
      return {
        ...ownProps,
        ...stateProps,
        moveBy: (x, y) => {
          dispatchProps.moveBy(ownProps.reduxPath, x, y)
        }
      }
    }
  )
)(({isOpen, reduxPath, ...props}) => {
  return isOpen && <Window {...props} />
});
