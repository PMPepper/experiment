import React, {useState, useCallback} from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from '@lingui/macro';

import { Button } from 'semantic-ui-react'

//Components
import Layout, {Row, Cell} from '@/components/layout/Layout';
//import Button from '@/components/button/Button';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import AvailableResearchProjects from '@/components/game/tables/AvailableResearchProjects';
import Modal from '@/components/modal/Modal';
import AddEditResearchGroup from '@/components/game/AddEditResearchGroup';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import useActions from '@/hooks/useActions';

//Helpers
import filter from '@/helpers/object/filter';

//reducers
import {setResearchSelectedArea} from '@/redux/reducers/coloniesWindow';


//The component
export default function WindowResearch({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));
  const setResearchSelectedAreaDispatcher = useActions(setResearchSelectedArea);

  const i18n = useI18n();
  const [isAddEditResearchGroupOpen, setIsAddEditResearchGroupOpen] = useState(false);
  const onClickOpenAddResearchGroup = useCallback(() => {setIsAddEditResearchGroupOpen(true)}, [setIsAddEditResearchGroupOpen]);
  const onCloseAddResearchGroup = useCallback(() => {setIsAddEditResearchGroupOpen(false)}, [setIsAddEditResearchGroupOpen]);

  const initialGameState = clientState.initialGameState;
  const researchAreas = initialGameState.researchAreas;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const selectedResearchProjectId = Object.keys(coloniesWindow.availableResearchTable.selectedRows).pop() || null;
  const selectedResearchProject = initialGameState.research[selectedResearchProjectId] && initialGameState.research[selectedResearchProjectId].area == coloniesWindow.researchSelectedArea ? initialGameState.research[selectedResearchProjectId] : null;

  const totalNumResearchFacilities = Object.values(colony.colony.structuresWithCapability.research).reduce((sum, add) => {return sum + add;}, 0);

  return <div className="vspaceStart">
    <div><Trans>Total research facilities: {totalNumResearchFacilities}</Trans></div>
    <div>
      <div className="hspaceStart">
        <Button onClick={onClickOpenAddResearchGroup}><Trans id="windowResearch.groups.create">Create</Trans></Button>
        <Button onClick={null}><Trans id="windowResearch.groups.edit">Edit</Trans></Button>
        <Button onClick={null}><Trans id="windowResearch.groups.remove">Remove</Trans></Button>
      </div>
    </div>
    <div>
      <h4>Available research projects</h4>
      <select className="space" value={coloniesWindow.researchSelectedArea} onChange={(e) => {setResearchSelectedAreaDispatcher(e.target.value)}}>
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
      isOpen={isAddEditResearchGroupOpen}
      onRequestClose={onCloseAddResearchGroup}
    >
      <AddEditResearchGroup
        //key={selectedResearchProject.id}
        //researchProject={selectedResearchProject}
        faction={faction}
        colony={colony}
        gameConfig={clientState.initialGameState}
      />
    </Modal>
  </div>
}


// getAvailableProjectRows = memoize((completedResearch, allResearchProjects, researchInProgress, area) => {
//   area = +area;
//   //const allResearchProjects = initialGameState.research;
//   //const completedResearch = faction.faction.research;
//   //const colony = this.colony;
//
//   return filter(allResearchProjects, (project, id) => {
//     return  (+project.area === area) &&//is this project in the selected area?
//             (!completedResearch[id]) &&//has this project already been researched?
//             (!researchInProgress[id]) &&//is this project currently being researched?
//             (project.requireResearchIds.every(requiredResearchId => (completedResearch[requiredResearchId])));//have the prerequisites been researched?
//   });
// });
