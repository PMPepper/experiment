import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

import Tree from '@/components/tree/Tree';
import Layout, {Row, Cell} from '@/components/layout/Layout';

import ColonyInfo from './ColonyInfo';

import map from '@/helpers/object/map';
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';

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

    //clientState.coloniesBySystemBySystemBody

    /*
    nodes = [
      {id: 'populatedSystems', label: 'Populated systems', icon: null, onClick: null, children: [
        {id: '1', label: 'Sol', icon: null, onClick: null, children: [
          {id: '4', label: 'Earth', icon: null, onClick: null},
        ]},
      ]},
      {id: 'automatedMiningColonies', label: 'Automated mining colonies', icon: null, onClick: null},
      {id: 'civilianMiningColonies', label: 'Civilian mining colonies', icon: null, onClick: null},
      {id: 'listeningPosts', label: 'Listening posts', icon: null, onClick: null},
      {id: 'archeologicalDigs', label: 'Archeological digs', icon: null, onClick: null},
      {id: 'terraformingSites', label: 'Terraforming sites', icon: null, onClick: null},
      {id: 'otherColonies', label: 'Other colonies sites', icon: null, onClick: null, children: [
        {id: '1', label: 'Sol', icon: null, onClick: null, children: [
          {id: '2', label: 'Mercury', icon: null, onClick: null},
        ]},
      ]},

      {id: 'foo', label: 'Foo', icon: null, onClick: null, children: [
        {id: 'bar', label: 'Bar', icon: null, onClick: null, children: [
          {id: 'x', label: 'x', icon: null, onClick: null},
          {id: 'y', label: 'y', icon: null, onClick: null, children: [
            {id: 'a', label: 'a', icon: null, onClick: null},
            {id: 'b', label: 'b', icon: null, onClick: null},
            {id: 'c', label: 'c', icon: null, onClick: null},
          ]},
          {id: 'z', label: 'z', icon: null, onClick: null, children: [
            {id: 'a', label: 'a', icon: null, onClick: null},
            {id: 'b', label: 'b', icon: null, onClick: null},
            {id: 'c', label: 'c', icon: null, onClick: null},
          ]},
        ]}
      ]}
    ];
    */

    //

    const colonyTreeNodes = mapToSortedArray(
      clientState.coloniesBySystemBySystemBody,
      (coloniesBySystemBodyId, systemId) => {
        const factionSystem = clientState.getFactionSystemFromSystem(systemId);

        return {
          id: systemId,
          label: factionSystem.factionSystem.name,
          children: mapToSortedArray(
            coloniesBySystemBodyId,
            (colony, systemBodyId) => {
              const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBodyId);

              return {id: systemBodyId, label: factionSystemBody.factionSystemBody.name};
            },
            (a, b) => {
              return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0);
            },
            true
          )
        };
      },
      (a, b) => {
        return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0);
      },
      true
    );


    return <Layout>
      <Row>
        <Cell large={3} medium={1}>
          <Tree nodes={colonyTreeNodes} id="colonies" {...coloniesWindow.tree} setIsNodeOpen={setIsNodeOpen} setNodeSelected={setNodeSelected} />
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
