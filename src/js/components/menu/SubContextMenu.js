import React from 'react';
import {compose} from 'recompose';

import PositionedItemComponent from '@/HOCs/PositionedItemComponent';


import Menu from './Menu';

export default compose(
  PositionedItemComponent()
)(Menu);
