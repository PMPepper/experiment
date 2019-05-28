import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";
import {I18n} from "@lingui/react";

import { Button } from 'semantic-ui-react'

//Components
import Layout, {Row, Cell} from '@/components/layout/Layout';
//import Button from '@/components/button/Button';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import AvailableResearchProjects from '@/components/game/tables/AvailableResearchProjects';
import Modal from '@/components/modal/Modal';
import AddEditResearchGroup from '@/components/game/AddEditResearchGroup';

//Helpers
import filter from '@/helpers/object/filter';

//reducers
import {setResearchSelectedArea} from '@/redux/reducers/coloniesWindow';


//The component
class WindowResearch extends React.Component {

  state = {
    isAddEditResearchGroupOpen: false
  };

  onClickAddResearchGroup = () => {
    this.setState({isAddEditResearchGroupOpen: true})
  }


  render () {
    return <I18n>{({i18n}) => {
      const initialGameState = this.props.clientState.initialGameState;
      const researchAreas = initialGameState.researchAreas;
      const coloniesWindow = this.props.coloniesWindow;
      const colony = this.colony;

      const selectedResearchProjectId = Object.keys(coloniesWindow.availableResearchTable.selectedRows).pop() || null;
      const selectedResearchProject = initialGameState.research[selectedResearchProjectId] && initialGameState.research[selectedResearchProjectId].area == coloniesWindow.researchSelectedArea ? initialGameState.research[selectedResearchProjectId] : null;

      const totalNumResearchFacilities = Object.values(colony.colony.structuresWithCapability.research).reduce((sum, add) => {return sum + add;}, 0);

      return <div className="vspaceStart">
        <div><Trans>Total research facilities: {totalNumResearchFacilities}</Trans></div>
        <div>
          <div className="hspaceStart">
            <Button onClick={this.onClickAddResearchGroup}><Trans id="windowResearch.groups.create">Create</Trans></Button>
            <Button onClick={null}><Trans id="windowResearch.groups.edit">Edit</Trans></Button>
            <Button onClick={null}><Trans id="windowResearch.groups.remove">Remove</Trans></Button>
          </div>
        </div>
        <div>
          <h4>Available research projects</h4>
          <select className="space" value={coloniesWindow.researchSelectedArea} onChange={(e) => {this.props.setResearchSelectedArea(e.target.value)}}>
            <option value="">{i18n._('windowResearch.area.select', null, {defaults: '- - Select - -'})}</option>
            {Object.keys(researchAreas).map(areaId => (<option value={areaId} key={areaId}>{researchAreas[areaId]}</option>))}
          </select>

          {/*<Layout>
            <Row>
              <Cell large={1} medium={1}>
                <ReduxDataTableState path="coloniesWindow.availableResearchTable">
                  <AvailableResearchProjects
                    clickToSelectRow={true}
                    rows={this.getAvailableProjectRows(
                      this.faction.faction.research,
                      initialGameState.research,
                      this.colony.colony.researchInProgress,
                      coloniesWindow.researchSelectedArea
                    )}
                  />
                </ReduxDataTableState>
              </Cell>
              <Cell large={1} medium={1}>
                {selectedResearchProject ?
                  <div>
                    <p>{selectedResearchProject.description}</p>

                    <button type="button" onClick={() => {this.setState({isAddEditResearchGroupOpen: true})}}><Trans>Create research project</Trans></button>
                  </div>
                  :
                  <Trans>Select a research project</Trans>
                }
              </Cell>
            </Row>
          </Layout>*/}


        </div>
        {/*Object.keys(researchAreas).map(areaId => {
          const availableReseachInArea = this.getAvailableResearchInArea(areaId);

          return <div key={areaId}>
            <h4>{researchAreas[areaId]}</h4>
            <ul>
              {Object.keys(availableReseachInArea).map(projectId => {
                const project = availableReseachInArea[projectId];

                return <li key={projectId}>{project.name}</li>
              })}
            </ul>
          </div>
        })*/}
        <Modal
          title={<Trans>Create research project</Trans>}
          isOpen={this.state.isAddEditResearchGroupOpen}
          onRequestClose={() => {this.setState({isAddEditResearchGroupOpen: false})}}
        >
          <AddEditResearchGroup
            //key={selectedResearchProject.id}
            //researchProject={selectedResearchProject}
            faction={this.faction}
            colony={this.colony}
            gameConfig={this.props.clientState.initialGameState}
          />
        </Modal>
      </div>;
    }}</I18n>
  }

  getAvailableProjectRows = memoize((completedResearch, allResearchProjects, researchInProgress, area) => {
    area = +area;
    //const allResearchProjects = initialGameState.research;
    //const completedResearch = faction.faction.research;
    //const colony = this.colony;

    return filter(allResearchProjects, (project, id) => {
      return  (+project.area === area) &&//is this project in the selected area?
              (!completedResearch[id]) &&//has this project already been researched?
              (!researchInProgress[id]) &&//is this project currently being researched?
              (project.requireResearchIds.every(requiredResearchId => (completedResearch[requiredResearchId])));//have the prerequisites been researched?
    });
  });

  get faction() {
    return this.props.clientState.entities[this.props.clientState.factionId];
  }

  get colony() {
    return this.props.clientState.entities[this.props.colonyId];
  }
}


export default compose(
  connect(state => {
    return {
      clientState: state.game,
      coloniesWindow: state.coloniesWindow,
      //selectedSystemId: state.selectedSystemId,
    }
  }, {
    setResearchSelectedArea
  })
)(WindowResearch);
