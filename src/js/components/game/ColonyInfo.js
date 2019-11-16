import React from 'react';
import {Trans} from '@lingui/macro';

//Components
import Tabs from '@/components/tabs/Tabs';
import Tab from '@/components/tabs/Tab';
import FormatNumber from '@/components/formatNumber/FormatNumber';

import WindowIndustry from './WindowIndustry';
import WindowResearch from './WindowResearch';
import WindowMining from './WindowMining';
import WindowShipbuilding from './WindowShipbuilding';

//Helpers


//The component
export default class ColonyInfo extends React.Component {
  render () {
    const {coloniesWindow, clientState, selectedSystemId, selectedColonyId, setTab} = this.props;

    const colony = clientState.entities[this.props.colonyId];

    if(!colony) {
      return null;//No colony selected
    }

    const systemBody = clientState.entities[colony.systemBodyId]
    const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBody);
    const structureDefinitions = clientState.initialGameState.structures;

    const isMineralsSurveyed = factionSystemBody.factionSystemBody.isSurveyed;



    return <div>
      <h2>{factionSystemBody.factionSystemBody.name}</h2>
      <Tabs selectedTabIndex={coloniesWindow.tab} setSelectedTabIndex={setTab}>
        <Tab key="summary" tab-title={<Trans>Summary</Trans>}>
          <p>Total population: <FormatNumber value={colony.colony.totalPopulation} /></p>
          <p>Total support overhead: <FormatNumber value={colony.colony.totalSupportWorkers} /></p>
          <p>Total effective workers: <FormatNumber value={colony.colony.totalEffectiveWorkers} /></p>
        </Tab>
        <Tab key="industry" tab-title={<Trans>Industry</Trans>}>
          <WindowIndustry colonyId={this.props.colonyId} />
        </Tab>
        <Tab key="mining" tab-title={<Trans>Mining</Trans>}>
          <WindowMining colonyId={this.props.colonyId} />
        </Tab>
        <Tab key="research" tab-title={<Trans>Research</Trans>}>
          <WindowResearch colonyId={this.props.colonyId} />
        </Tab>
        <Tab key="shipbuilding" tab-title={<Trans>Shipbuilding</Trans>}>
          <WindowShipbuilding colonyId={this.props.colonyId} />
        </Tab>
      </Tabs>
    </div>
  }
}
