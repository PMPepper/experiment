import React from 'react';
import {Trans} from '@lingui/macro';

//Components
import Tabs from '@/components/tabs/Tabs';
import Tab from '@/components/tabs/Tab';

import WindowColonySummary from './WindowColonySummary';
import WindowIndustry from './WindowIndustry';
import WindowResearch from './WindowResearch';
import WindowMining from './WindowMining';
import WindowShipbuilding from './WindowShipbuilding';


//The component
export default function ColonyInfo({name, colonyId, tab, setTab}) {
  return <div>
    <h2>{name}</h2>
    <Tabs selectedTabIndex={tab} setSelectedTabIndex={setTab}>
      <Tab key="summary" tab-title={<Trans>Summary</Trans>}>
        <WindowColonySummary colonyId={colonyId} />
      </Tab>
      <Tab key="industry" tab-title={<Trans>Industry</Trans>}>
        <WindowIndustry colonyId={colonyId} />
      </Tab>
      <Tab key="mining" tab-title={<Trans>Mining</Trans>}>
        <WindowMining colonyId={colonyId} />
      </Tab>
      <Tab key="research" tab-title={<Trans>Research</Trans>}>
        <WindowResearch colonyId={colonyId} />
      </Tab>
      <Tab key="shipbuilding" tab-title={<Trans>Shipbuilding</Trans>}>
        <WindowShipbuilding colonyId={colonyId} />
      </Tab>
    </Tabs>
  </div>
}
