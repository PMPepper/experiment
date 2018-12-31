import React from 'react';
import {compose} from 'recompose';
import {Trans} from "@lingui/macro"

//HOCs
import WindowSizeComponent from '@/HOCs/WindowSizeComponent';
import PositionedItemComponent, {minWithinBounds} from '@/HOCs/PositionedItemComponent';
import MonitorElementSizeComponent from '@/HOCs/MonitorElementSizeComponent';
import DraggableComponent from '@/HOCs/DraggableComponent';

//Components
import Panel from '@/components/panel/Panel';
import Icon from '@/components/icon/Icon';
import Button from '@/components/button/Button';

//Helpers
import combineProps from '@/helpers/react/combine-props';

//Consts
const minimumWithinBounds = 16;


//The component
export default compose(
  WindowSizeComponent({mapProps: (props, bounds) => ({bounds, ...props})}),
  PositionedItemComponent({
    xPosRule: minWithinBounds(minimumWithinBounds, minimumWithinBounds),
    yPosRule: minWithinBounds(-minimumWithinBounds, minimumWithinBounds)
  }),
  MonitorElementSizeComponent(),
  DraggableComponent({
    mapProps: ({moveBy, onRequestClose, ...props}, draggingProps) => {
      const mappedProps = {
        ...props,
        headerProps: combineProps(props.headerProps, draggingProps)
      }

      if(onRequestClose && !props.headerBtns) {
        mappedProps.headerBtns = makeCloseBtn(onRequestClose);
      }

      return mappedProps;
    }
  })
)(Panel);

export function makeCloseBtn(onRequestClose) {
  return <Button onClick={onRequestClose} theme="close">
    <Icon icon="times" />
    <span className="offscreen"><Trans>Close</Trans></span>
  </Button>;
}
