import React from 'react';
import {Trans} from '@lingui/macro';

import styles from './researchQueueOverview.scss';

//Components
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Progress from '@/components/progress/Progress';
import DL from '@/components/list/DL';
import Table from '@/components/table/Table';
import FormatNumber from '@/components/formatNumber/FormatNumber';
import FormatDate from '@/components/formatDate/FormatDate';

//Helpers
import map from '@/helpers/object/map';
import researchStructuresToArray from '@/helpers/app/researchStructuresToArray';
import getResearchProductionFromStructures from '@/helpers/app/getResearchProductionFromStructures';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';
import getResearchETA from '@/helpers/app/getResearchETA';


//The component
const ResearchQueueOverview = React.forwardRef(function ResearchQueueOverview({colony, gameTimeDate, researchQueue, gameConfig, entities, onEditClick, onRemoveClick}, ref) {
  const currentResearchId = researchQueue.researchQueue.researchIds[0]
  const currentResearchProject = currentResearchId ?
    gameConfig.research[currentResearchId]
    :
    null;
  const currentResearchProgress = currentResearchProject ?
    colony.colony.researchInProgress[currentResearchId]
    :
    null

  //get the actually assigned structures
  const assignedStructures = colony.colony.assignedResearchStructures[researchQueue.id] || {};

  //now work out how much research that produces
  const totalRPs = getResearchProductionFromStructures(assignedStructures, colony);
  const totalRPsFormatted = <FormatNumber value={totalRPs} />

  const eta = currentResearchProject ? getResearchETA(gameTimeDate, currentResearchProject.cost, currentResearchProgress, totalRPs) : null
  const etaFormatted = <FormatDate value={eta} format="date" />;

  return <div ref={ref} className={styles.researchQueueOverview}>
    <div className={styles.structures}>
      <h3 className={styles.researchTitle}><Trans>Assigned structures</Trans></h3>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.TH><Trans>Structure</Trans></Table.TH>
            <Table.TH><Trans>Species</Trans></Table.TH>
            <Table.TH><Trans># requested/assigned</Trans></Table.TH>
            <Table.TH><Trans>RP</Trans></Table.TH>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {researchStructuresToArray(researchQueue.researchQueue.structures)
            .sort()//TODO sort on what?
            .map(({populationId, structureId, quantity}) => {
              const species = entities[entities[populationId].speciesId];
              const quantityRequestedFormatted = <FormatNumber value={quantity} />;
              const quantityAssigned = (assignedStructures[populationId] && assignedStructures[populationId][structureId]) || 0;
              const quantityAssignedFormatted = <FormatNumber value={quantityAssigned} />;

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                <Table.TD>{species.species.name}</Table.TD>
                <Table.TD><Trans>{quantityRequestedFormatted} / {quantityAssignedFormatted}</Trans></Table.TD>
                <Table.TD><FormatNumber value={getCapabilityProductionForColonyPopulationStructure(colony, 'research', populationId, structureId) * quantityAssigned} /></Table.TD>
              </Table.Row >
            })
          }
        </Table.TBody>
        <Table.TFoot>
          <Table.Row>
            <Table.TD colSpan="4">
              <Trans>Total RP: {totalRPsFormatted}</Trans>
            </Table.TD>
          </Table.Row>
        </Table.TFoot>
      </Table>

    </div>
    <div className={styles.research}>
      <h3 className={styles.researchTitle}><Trans>Current research</Trans></h3>
      {currentResearchProject ?
        <>
          <h4>{currentResearchProject.name}</h4>
          <p><Trans>ETA: {etaFormatted}</Trans></p>
          <Progress value={currentResearchProgress} max={currentResearchProject.cost} showValues />
          {researchQueue.researchQueue.researchIds.length > 1 && <p><Trans>+ {researchQueue.researchQueue.researchIds.length - 1} more</Trans></p>}
        </>
        :
        <p className="bodyCopy"><Trans>No research queued</Trans></p>
      }
    </div>
    <Buttons position="right">
      {onEditClick && <Button onClick={() => {onEditClick(researchQueue.id);}}><Trans id="researchQueueOverview.edit">Edit</Trans></Button>}
      {onRemoveClick && <Button onClick={() => {onRemoveClick(researchQueue.id);}}><Trans id="researchQueueOverview.remove">Remove</Trans></Button>}
    </Buttons>
  </div>
});

export default ResearchQueueOverview;
