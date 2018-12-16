import React from 'react';
import {compose, withStateHandlers} from 'recompose';

import Tabs from './Tabs';


export default compose(
  withStateHandlers(
    {selectedTabIndex: 0},
    {setSelectedTabIndex: () => (selectedTabIndex) => ({selectedTabIndex})}
  )
)(Tabs);
