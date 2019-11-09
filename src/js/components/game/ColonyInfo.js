import React from 'react';
//import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from '@lingui/macro';

//Internal components
import ColonyMineralsTable from './tables/ColonyMinerals';

//Components
import Tabs from '@/components/tabs/Tabs';
import Tab from '@/components/tabs/Tab';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import FormatNumber from '@/components/formatNumber/FormatNumber';

import WindowIndustry from './WindowIndustry';
import WindowResearch from './WindowResearch';

//Helpers
import map from '@/helpers/object/map';
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import roundToDigits from '@/helpers/math/round-to-digits';


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

    //Mineral rows
    const mineralsRows = isMineralsSurveyed ? map(clientState.initialGameState.minerals, (mineral, mineralId) => {
      const systemBodyMinerals = systemBody.availableMinerals[mineralId];
      const dailyProduction = (colony.colony.capabilityProductionTotals.mining || 0) * systemBodyMinerals.access;

      return {
        mineral,
        quantity: Math.ceil(systemBodyMinerals.quantity),
        access: systemBodyMinerals.access,
        production: dailyProduction,
        depletion: dailyProduction > 0 ? roundToDigits(systemBodyMinerals.quantity / (dailyProduction * 365.25), 3) : Number.NaN,
        stockpile: Math.floor(colony.colony.minerals[mineralId]),
      };
    }) : null;

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
          {colony.colony.structuresWithCapability.mining && <p>{mapToSortedArray(colony.colony.structuresWithCapability.mining, (quantity, structureId) => {
            const structureDefinition = structureDefinitions[structureId];

            return <span key="structureId">{structureDefinition.name}: {quantity}</span>
          }, (a, b) => {
            console.log(a, b);
            debugger;//TODO
            return 0;
          })}</p>}
          {isMineralsSurveyed ?
            <ReduxDataTableState path="coloniesWindow.mineralsTable"><ColonyMineralsTable rows={mineralsRows} /></ReduxDataTableState>
            :
            <span><Trans>System body not surveyed</Trans></span>
          }
        </Tab>
        <Tab key="research" tab-title={<Trans>Research</Trans>}>
          <WindowResearch colonyId={this.props.colonyId} />
        </Tab>
      </Tabs>
    </div>
  }
}
