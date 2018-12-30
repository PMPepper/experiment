import React from 'react';
import {compose} from 'recompose';

import PositionedItemComponent, {afterOrBefore, startOrEnd} from '@/HOCs/PositionedItemComponent';
import GetElementPositionComponent from '@/HOCs/GetElementPositionComponent';
import MonitorElementSizeComponent from '@/HOCs/MonitorElementSizeComponent';
import WindowBoundsComponent from '@/HOCs/WindowBoundsComponent';


import Menu from './Menu';

export default compose(
  WindowBoundsComponent(),
  GetElementPositionComponent(),
  PositionedItemComponent({
    xPosRule: afterOrBefore,
    yPosRule: startOrEnd
  }),
  MonitorElementSizeComponent()
)(Menu);
