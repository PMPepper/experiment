import React, {useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

import styles from './windowResearch.scss';

//Components
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Modal from '@/components/modal/Modal';
import AddEditResearchQueue from '@/components/game/AddEditResearchQueue';
import ResearchQueueOverview from '@/components/game/ResearchQueueOverview';
import Table from '@/components/table/Table';
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import useActions from '@/hooks/useActions';
import {useClient} from '@/components/game/Game';

//Helpers
import filter from '@/helpers/object/filter';
import reduce from '@/helpers/object/reduce';
import forEach from '@/helpers/object/forEach';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';
import getColonyAssignedResearchStructures from '@/helpers/app/getColonyAssignedResearchStructures';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import sortStructuresByNameAndSpecies from '@/helpers/app-ui/sort-structures-by-name-and-species';

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

  const gameConfig = clientState.initialGameState;
  const researchAreas = gameConfig.researchAreas;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const selectedResearchProjectId = Object.keys(coloniesWindow.availableResearchTable.selectedRows).pop() || null;
  const selectedResearchProject = gameConfig.research[selectedResearchProjectId] && gameConfig.research[selectedResearchProjectId].area == coloniesWindow.researchSelectedArea ? gameConfig.research[selectedResearchProjectId] : null;

  const totalNumResearchFacilities = Object.values(colony.colony.structuresWithCapability.research).reduce((sum, add) => {return sum + add;}, 0);

  const client = useClient();

  const colonyResearchStructures = getColonyStructuresCapabilities(colony, 'research');
  const totalColonyResearchFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.research} />;
  const assignedStructures = getColonyAssignedResearchStructures(colony);



  return <div className="vspaceStart">
    <h2 className={styles.title}><Trans>Colony research facilities</Trans></h2>
    <div className={styles.structures}>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.TH><Trans>Structure</Trans></Table.TH>
            <Table.TH><Trans>Species</Trans></Table.TH>
            <Table.TH><Trans># available/total</Trans></Table.TH>
            <Table.TH><Trans>RP/facility</Trans></Table.TH>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {colonyResearchStructures
            .sort(sortStructuresByNameAndSpecies(i18n.language, clientState.entities, gameConfig))
            .filter(({quantity}) => (quantity > 0))
            .map(({populationId, structureId, quantity}) => {
              const assigned = (assignedStructures[populationId] && assignedStructures[populationId][structureId]) || 0;
              const available = quantity - assigned;
              const availableFormatted = <FormatNumber value={available} />
              const totalFormatted = <FormatNumber value={quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'research', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                <Table.TD>{clientState.entities[clientState.entities[populationId].speciesId].species.name}</Table.TD>
                <Table.TD><Trans>{availableFormatted} / {totalFormatted}</Trans></Table.TD>
                <Table.TD><FormatNumber value={rps} /></Table.TD>
              </Table.Row>
            })
          }
        </Table.TBody>
        <Table.TFoot>
          <Table.Row>
            <Table.TD colSpan="4">
              <div className="alignEnd"><Trans>Colony total RP: {totalColonyResearchFormatted}</Trans></div>
            </Table.TD>
          </Table.Row>
        </Table.TFoot>
      </Table>
    </div>

    <h2 className={styles.title}><Trans>Research queues</Trans></h2>
    <ul className={styles.researchQueueList}>
      {colony.researchQueueIds.map(researchQueueId => {
        const researchQueue = clientState.entities[researchQueueId];

        return <li key={researchQueueId}>
          <ResearchQueueOverview colony={colony} researchQueue={researchQueue} gameTimeDate={clientState.gameTimeDate} gameConfig={gameConfig} entities={clientState.entities} onEditClick={onClickEditResearchGroup} onRemoveClick={onClickRemoveResearchGroup} />
        </li>
      })}
    </ul>
    <div>
      <Buttons position="right">
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
