import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

import DataTable from '@/components/datatable/LocalStateDataTable';

import map from '@/helpers/object/map';


class WindowColonies extends React.Component {

  systemColonies = memoize((selectedSystemId, clientState) => {
    const allColonies = clientState.getColoniesBySystemBody(selectedSystemId);

    return map(allColonies, (colony) => {
      const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(colony.systemBodyId);
      const totalPopulation = colony.populationIds.reduce((total, id) => (total + clientState.entities[id].population.quantity), 0) | 0;

      return {
        name: factionSystemBody.factionSystemBody.name,
        totalPopulation: totalPopulation,
      }
    });
  })

  render () {
    const {coloniesWindow, clientState, selectedSystemId} = this.props;

    // factionId: 182
    // id: 364
    // populationIds: [363]
    // systemBodyId: 5
    // systemId: 1
    // type: "colony"

    return <div>
      <DataTable
        columns={[
          {label: <Trans>Name</Trans>, name: 'name', sort: true},
          {label: <Trans>Population</Trans>, name: 'totalPopulation', sort: true, valueType: 'number'}
        ]}
        rows={this.systemColonies(selectedSystemId, clientState)}
      />
    </div>;
  }
}





export default compose(
  connect(state => {
    return {
      coloniesWindow: state.coloniesWindow,
      clientState: state.game,
      selectedSystemId: state.selectedSystemId,
    }
  }, {

  })
)(WindowColonies);
