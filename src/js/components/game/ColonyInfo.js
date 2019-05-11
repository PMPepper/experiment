import React from 'react';
//import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

//Internal components
import ColonyMineralsTable from './tables/ColonyMinerals';

//Components
import Tabs from '@/components/tabs/Tabs';
import Tab from '@/components/tabs/Tab';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Helpers
import map from '@/helpers/object/map';
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import roundToDigits from '@/helpers/math/round-to-digits';


//The component
export default class ColonyInfo extends React.Component {
  render () {
    const {coloniesWindow, clientState, selectedSystemId, selectedColonyId, setTab} = this.props;

    const colony = clientState.entities[coloniesWindow.selectedColonyId];

    if(!colony) {
      return null;//No colony selected
    }

    const systemBody = clientState.entities[colony.systemBodyId]
    const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBody);
    const structureDefinitions = clientState.initialGameState.structures;

    const isMineralsSurveyed = factionSystemBody.factionSystemBody.isSurveyed;


    //Mineral rows
    const miningProduction = colony.colony.miningProduction;

    const mineralsRows = isMineralsSurveyed ? map(clientState.initialGameState.minerals, (mineral, mineralId) => {
      const systemBodyMinerals = systemBody.availableMinerals[mineralId];
      const annualProduction = miningProduction * systemBodyMinerals.access;

      return {
        mineral,
        quantity: Math.ceil(systemBodyMinerals.quantity),
        access: systemBodyMinerals.access,
        production: annualProduction,
        depletion: roundToDigits(systemBodyMinerals.quantity / annualProduction, 3),
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
          Industry!
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
      </Tabs>
    </div>
  }
}
