import React from 'react';
import {compose} from 'recompose';

//HOCs
import WindowSizeComponent from '@/HOCs/WindowSizeComponent';
import PositionedItemComponent, {minWithinBounds} from '@/HOCs/PositionedItemComponent';
import MonitorElementSizeComponent from '@/HOCs/MonitorElementSizeComponent';
import DraggableComponent from '@/HOCs/DraggableComponent';

//Components
import Panel from '@/components/panel/Panel';

//Helpers
import combineProps from '@/helpers/react/combine-props';

//Consts
const minimumWithinBounds = 16;


//The component
export default compose(
  WindowSizeComponent({mapProps: (props, bounds) => ({bounds, ...props})}),
  PositionedItemComponent({
    xPosRule: minWithinBounds(minimumWithinBounds, minimumWithinBounds),
    yPosRule: minWithinBounds(minimumWithinBounds, minimumWithinBounds)
  }),
  MonitorElementSizeComponent(),
  DraggableComponent({
    mapProps: ({moveBy, ...props}, draggingProps) => {
      return {
        ...props,
        headerProps: combineProps(props.headerProps, draggingProps)
      }
    }
  })
)(Panel);
