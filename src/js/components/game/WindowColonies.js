import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";

import Tree from '@/components/tree/Tree';
import Layout, {Row, Cell} from '@/components/layout/Layout';

import ColonyInfo from './ColonyInfo';

import map from '@/helpers/object/map';
import modify from '@/helpers/object/modify';
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';

import {setTab, setSelectedColonyId} from '@/redux/reducers/coloniesWindow';
import {setSelectedSystemId} from '@/redux/reducers/selectedSystemId';
import {setFollowing as setSystemMapFollowing} from '@/redux/reducers/systemMap';

const coloniesTreeId = 'colonies';


class WindowColonies extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.coloniesWindow.selectedColonyId ?
      {
        isNodeOpen: {
          [this.selectedColonySystemNodeId]: true
        },
        selectedNode: this.selectedColonyNodeId
      }
      :
      {//no colony selected at time of opening
        isNodeOpen: {},
        selectedNode: null
      };
  }

  setIsNodeOpen = (node, isOpen) => {
    console.log('setIsNodeOpen: ', node, isOpen);

    this.setState({isNodeOpen: modify(this.state.isNodeOpen, node, !!isOpen)})
  }

  setNodeSelected = (node) => {
    console.log('setNodeSelected: ', node);
  }

  get selectedColonyNodeId() {
    const colonyId = +this.props.coloniesWindow.selectedColonyId;
    const clientState = this.props.clientState;
    const colony = clientState.entities[colonyId];
    const systemBody = clientState.entities[colony.systemBodyId];
    //coloniesTreeId
    return `colonies/${systemBody.systemId}/${systemBody.id}`;
  }

  get selectedColonySystemNodeId() {
    const colonyId = +this.props.coloniesWindow.selectedColonyId;
    const clientState = this.props.clientState;
    const colony = clientState.entities[colonyId];
    const systemBody = clientState.entities[colony.systemBodyId];
    //coloniesTreeId
    return `colonies/${systemBody.systemId}`;
  }


  /////////////////////////////
  // React lifecycle methods //
  /////////////////////////////

  componentDidUpdate(oldProps) {
    if(this.props.coloniesWindow.selectedColonyId !== oldProps.coloniesWindow.selectedColonyId) {

      if(this.props.coloniesWindow.selectedColonyId) {
        //selected colony has changed, set this node as selected and make sure all parents are open
        this.setState({selectedNode: this.selectedColonyNodeId, isNodeOpen: modify(this.state.isNodeOpen, this.selectedColonySystemNodeId, true)})
      } else {
        //no colony selected - clear selected
        this.setState({selectedNode: null})
      }
    }
  }

  render () {
    const {props, state, setIsNodeOpen, setNodeSelected} = this;
    const {selectedNode, isNodeOpen} = state;
    const {coloniesWindow, clientState, selectedSystemId, setSelectedSystemId, setSelectedColonyId, setTab, setSystemMapFollowing} = props;

    const colonyTreeNodes = mapToSortedArray(
      clientState.coloniesBySystemBySystemBody,
      (coloniesBySystemBodyId, systemId) => {
        const factionSystem = clientState.getFactionSystemFromSystem(systemId);

        return {
          id: systemId,
          label: factionSystem.factionSystem.name,
          onClick: () => {setSelectedSystemId(systemId)},
          children: mapToSortedArray(
            coloniesBySystemBodyId,
            (colony, systemBodyId) => {
              const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBodyId);

              return {
                id: systemBodyId,
                label: factionSystemBody.factionSystemBody.name,
                onClick: () => {
                  setSelectedSystemId(systemId);
                  setSystemMapFollowing(systemBodyId);
                  setSelectedColonyId(colony.id);
                },
              };
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

    //Not at all sure abou this..?
    //const selectedNode = coloniesWindow.selectedColonyId ? `colonies/${selectedSystemId}/${clientState.entities[coloniesWindow.selectedColonyId].systemBodyId}` : `colonies/${selectedSystemId}`;


    return <Layout>
      <Row>
        <Cell large={2} medium={1}>
          <Tree nodes={colonyTreeNodes} id={coloniesTreeId} isNodeOpen={isNodeOpen} setIsNodeOpen={setIsNodeOpen} selectedNode={selectedNode} setIsNodeOpen={setIsNodeOpen} />
        </Cell>
        <Cell large={10} medium={2}>
          <ColonyInfo coloniesWindow={coloniesWindow} clientState={clientState} selectedSystemId={selectedSystemId} colonyId={coloniesWindow.selectedColonyId} setTab={setTab} />
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
    setSelectedSystemId,
    setSystemMapFollowing,
    setSelectedColonyId,
  })
)(WindowColonies);
