import React from 'react';
//import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

//Internal components
import ColonyMineralsTable from './tables/ColonyMinerals';

//Components
import Tabs from '@/components/tabs/Tabs';

//Helpers
import map from '@/helpers/object/map';


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

    //Mineral rows
    const mineralsRows = isMineralsSurveyed ? map(clientState.initialGameState.minerals, (mineral, mineralId) => {
      const systemBodyMinerals = systemBody.availableMinerals[mineralId];

      return {
        mineral,
        quantity: systemBodyMinerals.quantity,
        access: systemBodyMinerals.access,
        production: 0, //TODO
        depletion: 100, //TODO
        stockpile: 0//TODO
      };
    }) : null;

    return <div>
      <h2>{factionSystemBody.factionSystemBody.name}</h2>
      <Tabs selectedTabIndex={coloniesWindow.tab} setSelectedTabIndex={setTab}>
        <div key="summary" tab-title={<Trans>Summary</Trans>}>
          Summary!
        </div>
        <div key="industry" tab-title={<Trans>Industry</Trans>}>
          Industry!
        </div>
        <div key="mining" tab-title={<Trans>Mining</Trans>}>
          Mining!
          {isMineralsSurveyed ?
            <ColonyMineralsTable rows={mineralsRows} />
            :
            <span><Trans>System body not surveyed</Trans></span>
          }
        </div>
      </Tabs>
    </div>
  }
}
