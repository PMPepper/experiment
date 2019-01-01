import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//Internal
import Window from './Window';

//Helpers
import resolvePath from '@/helpers/object/resolve-path';
import combineProps from '@/helpers/react/combine-props';

//Reducers
import {moveTo} from '@/redux/HORs/position';
import {close} from '@/redux/HORs/isOpen';
import {interact} from '@/redux/HORs/lastInteracted';


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
      moveTo,
      close,
      interact
    },
    (stateProps, dispatchProps, ownProps) => {
      return combineProps(
        ownProps,
        stateProps,
        {
          onMouseDown: () => {dispatchProps.interact(ownProps.reduxPath)},
          onRequestClose: () => {dispatchProps.close(ownProps.reduxPath)},
          moveBy: function (dx, dy, props) {
            dispatchProps.moveTo(ownProps.reduxPath, props.position.x + dx, props.position.y + dy);
          }
        }
      )
    }
  )
)(({isOpen, reduxPath, ...props}) => {
  return isOpen && <Window {...props} />
});
