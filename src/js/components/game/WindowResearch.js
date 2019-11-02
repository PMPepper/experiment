import React, {useState, useCallback} from 'react';
import memoize from 'memoize-one';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from '@lingui/macro';

import styles from './windowResearch.scss';

//Components
import Layout, {Row, Cell} from '@/components/layout/Layout';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import AvailableResearchProjects from '@/components/game/tables/AvailableResearchProjects';
import Modal from '@/components/modal/Modal';
import AddEditResearchQueue from '@/components/game/AddEditResearchQueue';
import ResearchQueueOverview from '@/components/game/ResearchQueueOverview';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import useActions from '@/hooks/useActions';
import {useClient} from '@/components/game/Game';

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
  const [isAddEditResearchQueueOpen, setIsAddEditResearchQueueOpen] = useState(false);
  const [editResearchGroupId, setEditResearchGroupId] = useState(null);

  const onClickAddResearchGroup = useCallback(() => {
    setEditResearchGroupId(null);
    setIsAddEditResearchQueueOpen(true);
  }, [setIsAddEditResearchQueueOpen, setEditResearchGroupId]);

  const onCloseAddResearchGroup = useCallback(() => {
    setIsAddEditResearchQueueOpen(false);
  }, [setIsAddEditResearchQueueOpen]);

  const onClickEditResearchGroup = useCallback((researchGroupId) => {
    setEditResearchGroupId(researchGroupId);
    setIsAddEditResearchQueueOpen(true);
  }, [setEditResearchGroupId, setIsAddEditResearchQueueOpen]);

  const onClickRemoveResearchGroup = useCallback(researchGroupId => {
    client.removeResearchQueue(researchGroupId).then(result => {
      //research queue removed
    })
  }, []);

  const initialGameState = clientState.initialGameState;
  const researchAreas = initialGameState.researchAreas;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const selectedResearchProjectId = Object.keys(coloniesWindow.availableResearchTable.selectedRows).pop() || null;
  const selectedResearchProject = initialGameState.research[selectedResearchProjectId] && initialGameState.research[selectedResearchProjectId].area == coloniesWindow.researchSelectedArea ? initialGameState.research[selectedResearchProjectId] : null;

  const totalNumResearchFacilities = Object.values(colony.colony.structuresWithCapability.research).reduce((sum, add) => {return sum + add;}, 0);

  const client = useClient();

  return <div className="vspaceStart">
    <div><Trans>Total research facilities: {totalNumResearchFacilities}</Trans></div>
    <div>TODO show breakdown of total/available reserach facilities</div>
    <ul className={styles.researchQueueList}>
      {colony.researchQueueIds.map(researchQueueId => {
        const researchQueue = clientState.entities[researchQueueId];

        return <li key={researchQueueId}>
          <ResearchQueueOverview colony={colony} researchQueue={researchQueue} gameTimeDate={clientState.gameTimeDate} gameConfig={clientState.initialGameState} entities={clientState.entities} onEditClick={onClickEditResearchGroup} onRemoveClick={onClickRemoveResearchGroup} />
        </li>
      })}
    </ul>
    <div>
      <Buttons>
        <Button onClick={onClickAddResearchGroup}><Trans id="windowResearch.groups.create">Create</Trans></Button>
      </Buttons>
    </div>
    <Modal
      title={editResearchGroupId ? <Trans>Edit research queue</Trans> : <Trans>Add research queue</Trans>}
      isOpen={isAddEditResearchQueueOpen}
      onRequestClose={onCloseAddResearchGroup}
    >
      <AddEditResearchQueue
        faction={faction}
        colony={colony}
        clientState={clientState}
        researchQueue={editResearchGroupId ? clientState.entities[editResearchGroupId] : null}
        onComplete={(structures, researchIds) => {
          if(editResearchGroupId) {
            ///Edit queue
            client.updateResearchQueue(editResearchGroupId, structures, researchIds).then(result => {
              //research queue updated
              onCloseAddResearchGroup();
            })
          } else {
            //Add new queue
            client.createResearchQueue(colony.id, structures, researchIds).then(result => {
              //research queue added
              onCloseAddResearchGroup();
            });
          }
        }}
      />
    </Modal>
  </div>
}
