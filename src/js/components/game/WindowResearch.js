import React from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro";
import {I18n} from "@lingui/react";

//Components
import Layout, {Row, Cell} from '@/components/layout/Layout';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import AvailableResearchProjects from '@/components/game/tables/AvailableResearchProjects';

//Helpers
import filter from '@/helpers/object/filter';

//reducers
import {setResearchSelectedArea} from '@/redux/reducers/coloniesWindow';


//The component
class WindowResearch extends React.Component {


  render () {
    return <I18n>{({i18n}) => {
      const initialGameState = this.props.clientState.initialGameState;
      const researchAreas = initialGameState.researchAreas;
      const coloniesWindow = this.props.coloniesWindow;
      const colony = this.colony;

      const selectedResearchProjectId = Object.keys(coloniesWindow.availableResearchTable.selectedRows).pop() || null;
      const selectedResearchProject = initialGameState.research[selectedResearchProjectId] && initialGameState.research[selectedResearchProjectId].area == coloniesWindow.researchSelectedArea ? initialGameState.research[selectedResearchProjectId] : null;

      return <div className="vspaceStart">
        <div>TODO in progress research projects</div>
        <div>
          <h4>Available research projects</h4>
          <select className="space" value={coloniesWindow.researchSelectedArea} onChange={(e) => {this.props.setResearchSelectedArea(e.target.value)}}>
            <option value="">{i18n._('windowResearch.area.select', null, {defaults: '- - Select - -'})}</option>
            {Object.keys(researchAreas).map(areaId => (<option value={areaId} key={areaId}>{researchAreas[areaId]}</option>))}
          </select>

          <Layout>
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
                {selectedResearchProject ? selectedResearchProject.description : <Trans>Select a research project</Trans>}
              </Cell>
            </Row>
          </Layout>


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
