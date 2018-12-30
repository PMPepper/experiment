import React from 'react';
import {compose} from 'recompose';

//HOCs
import PositionedItemComponent, {afterOrBefore, startOrEnd} from '@/HOCs/PositionedItemComponent';
import GetElementPositionComponent from '@/HOCs/GetElementPositionComponent';
import MonitorElementSizeComponent from '@/HOCs/MonitorElementSizeComponent';
import WindowBoundsComponent from '@/HOCs/WindowBoundsComponent';

//Components
import Menu from '@/components/menu/Menu';


//The component
export default compose(
  WindowBoundsComponent(),
  GetElementPositionComponent(),
  PositionedItemComponent({
    xPosRule: afterOrBefore,
    yPosRule: startOrEnd,
    usePortal: false
  }),
  MonitorElementSizeComponent()
)(Menu);
