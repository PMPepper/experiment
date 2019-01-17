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

//Helpers
import map from '@/helpers/object/map';
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import forEach from '@/helpers/object/forEach';
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
    const isMineralsSurveyed = factionSystemBody.factionSystemBody.isSurveyed;
    const structureDefinitions = clientState.initialGameState.structures;

    //structures
    const structuresWithCapability = {};//List of all structures with this capability
    const totalStructureCapabilities = {};//quantity for each capability/structure

    //for each type of structure in the colony...
    forEach(colony.colony.structures, (quantity, structureId) => {
      const structureDefinition = structureDefinitions[structureId];

      if(!structureDefinition) {
        throw new Error(`Unknown structure: '${structureId}'`);
      }

      //for every type of thing (capability) this structure can do (e.g. mining, reseach, etc)...
      forEach(structureDefinition.capabilities, (value, capability) => {
        if(!(capability in totalStructureCapabilities)) {
          totalStructureCapabilities[capability] = 0;
          structuresWithCapability[capability] = {};
        }

        //record the total for the colony of this action (e.g. total amount of mining we can perform, etc)...
        totalStructureCapabilities[capability] += value * quantity;

        //...AND record the quantities of structures that can perform this action (e.g. mining can be performed by 3 basic mines, 14 PE mines)
        structuresWithCapability[capability][structureId] = quantity;
      });
    })


    //Mineral rows
    const miningProduction = (totalStructureCapabilities.mining || 0) * 1 * 1;//TODO include species mining rate here + any other adjustments (labour shortage, morale etc)

    const mineralsRows = isMineralsSurveyed ? map(clientState.initialGameState.minerals, (mineral, mineralId) => {
      const systemBodyMinerals = systemBody.availableMinerals[mineralId];
      const annualProduction = miningProduction * systemBodyMinerals.access;

      return {
        mineral,
        quantity: systemBodyMinerals.quantity,
        access: systemBodyMinerals.access,
        production: annualProduction,
        depletion: roundToDigits(systemBodyMinerals.quantity / annualProduction, 3),
        stockpile: 0//TODO
      };
    }) : null;

    return <div>
      <h2>{factionSystemBody.factionSystemBody.name}</h2>
      <Tabs selectedTabIndex={coloniesWindow.tab} setSelectedTabIndex={setTab}>
        <Tab key="summary" tab-title={<Trans>Summary</Trans>}>
          Summary!
        </Tab>
        <Tab key="industry" tab-title={<Trans>Industry</Trans>}>
          Industry!
        </Tab>
        <Tab key="mining" tab-title={<Trans>Mining</Trans>}>
          {structuresWithCapability.mining && <p>{mapToSortedArray(structuresWithCapability.mining, (quantity, structureId) => {
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
