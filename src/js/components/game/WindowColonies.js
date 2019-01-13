import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

import Tree from '@/components/tree/Tree';
import Layout, {Row, Cell} from '@/components/layout/Layout';

import ColonyInfo from './ColonyInfo';

import map from '@/helpers/object/map';


import {setTab, setIsNodeOpen, setNodeSelected} from '@/redux/reducers/coloniesWindow';


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
    const {coloniesWindow, clientState, selectedSystemId, setTab, setIsNodeOpen, setNodeSelected} = this.props;

    // factionId: 182
    // id: 364
    // populationIds: [363]
    // systemBodyId: 5
    // systemId: 1
    // type: "colony"

    clientState.coloniesBySystemBySystemBody

    return <Layout>
      <Row>
        <Cell large={3} medium={1}>
          <Tree id="colonies" {...coloniesWindow.tree} setIsNodeOpen={setIsNodeOpen} setNodeSelected={setNodeSelected} />
        </Cell>
        <Cell large={9} medium={2}>
          <ColonyInfo coloniesWindow={coloniesWindow} clientState={clientState} selectedSystemId={selectedSystemId} setTab={setTab} />
        </Cell>
      </Row>
    </Layout>;
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
    setTab,
    setIsNodeOpen,
    setNodeSelected
  })
)(WindowColonies);
