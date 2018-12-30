import React from 'react';
import {compose} from 'recompose';

import PositionedItemComponent, {afterOrBefore, startOrEnd} from '@/HOCs/PositionedItemComponent';
import GetElementPositionComponent from '@/HOCs/GetElementPositionComponent';
import MonitorElementSizeComponent from '@/HOCs/MonitorElementSizeComponent';


import Menu from './Menu';

export default compose(
  GetElementPositionComponent(),
  PositionedItemComponent({
    xPosRule: afterOrBefore,
    yPosRule: startOrEnd
  }),
  MonitorElementSizeComponent()
)(Menu);
