import React from 'react';
//import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

import DataTable from '@/components/datatable/LocalStateDataTable';
import Tabs from '@/components/tabs/Tabs';

import map from '@/helpers/object/map';



export default class ColonyInfo extends React.Component {

  /*systemColonies = memoize((selectedSystemId, clientState) => {
    const allColonies = clientState.getColoniesBySystemBody(selectedSystemId);

    return map(allColonies, (colony) => {
      const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(colony.systemBodyId);
      const totalPopulation = colony.populationIds.reduce((total, id) => (total + clientState.entities[id].population.quantity), 0) | 0;

      return {
        name: factionSystemBody.factionSystemBody.name,
        totalPopulation: totalPopulation,
      }
    });
  })*/

  render () {
    const {coloniesWindow, clientState, selectedSystemId, selectedColonyId, setTab} = this.props;

    const colony = clientState.entities[coloniesWindow.selectedColonyId];


    if(!colony) {
      return null;//No colony selected
    }

    const systemBody = clientState.entities[colony.systemBodyId]
    const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBody);

    // factionId: 182
    // id: 364
    // populationIds: [363]
    // systemBodyId: 5
    // systemId: 1
    // type: "colony"

    return <div>
      <h2>{factionSystemBody.factionSystemBody.name}</h2>
      <Tabs selectedTabIndex={coloniesWindow.tab} setSelectedTabIndex={setTab}>
        <div key="summary" tab-title={<Trans>Summary</Trans>}>
          Summary!
          {/*<DataTable
            columns={[
              {label: <Trans>Name</Trans>, name: 'name', sort: true},
              {label: <Trans>Population</Trans>, name: 'totalPopulation', sort: true, valueType: 'number'}
            ]}
            rows={this.systemColonies(selectedSystemId, clientState)}
          />*/}
        </div>
        <div key="industry" tab-title={<Trans>Industry</Trans>}>
          Industry!
        </div>
        <div key="mining" tab-title={<Trans>Mining</Trans>}>
          Mining!
        </div>
      </Tabs>
    </div>
  }
}
