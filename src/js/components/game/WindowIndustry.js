import React, {useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

import styles from './windowIndustry.scss';

//Components
//import Layout, {Row, Cell} from '@/components/layout/Layout';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Table from '@/components/table/Table';
import FormatNumber from '@/components/formatNumber/FormatNumber';
import Reorder from '@/components/reorder/Reorder';
import Form from '@/components/form/Form';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';

//Helpers
import forEach from '@/helpers/object/forEach';
import every from '@/helpers/object/every';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';


//The component
export default function WindowIndustry({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));

  const i18n = useI18n();

  const gameConfig = clientState.initialGameState;
  //const researchAreas = gameConfig.researchAreas;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const hasMultiplePopulations = colony.populationIds.length > 1;

  const colonyConstructionStructures = getColonyStructuresCapabilities(colony, 'construction');

  const totalColonyConstructionFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.construction} />;

  //internal state stuff
  const [selectedAddStructureId, setSelectedAddStructureId] = useState(null);
  const [selectedAddStructureQuantity, setSelectedAddStructureQuantity] = useState(1);

  return <div className="vspaceStart">
    <h2 className={styles.title}><Trans>Colony construction facilities</Trans></h2>
    <div className={styles.structures}>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.TH><Trans>Structure</Trans></Table.TH>
            {hasMultiplePopulations && <Table.TH><Trans>Species</Trans></Table.TH>}
            <Table.TH><Trans>#</Trans></Table.TH>
            <Table.TH><Trans>Production/facility</Trans></Table.TH>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {colonyConstructionStructures
            .sort()//TODO sort on what?
            .map(({populationId, structureId, quantity}) => {
              const availableFormatted = <FormatNumber value={quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'construction', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{clientState.entities[clientState.entities[populationId].speciesId].species.name}</Table.TD>}
                <Table.TD><Trans>{availableFormatted}</Trans></Table.TD>
                <Table.TD><FormatNumber value={rps} /></Table.TD>
              </Table.Row>
            })
          }
        </Table.TBody>
        <Table.TFoot>
          <Table.Row>
            <Table.TD colSpan={hasMultiplePopulations ? 4 : 3}>
              <div className="alignEnd"><Trans>Colony total RP: {totalColonyConstructionFormatted}</Trans></div>
            </Table.TD>
          </Table.Row>
        </Table.TFoot>
      </Table>
    </div>

    <h2 className={styles.title}><Trans>Colony construction queue</Trans></h2>
    <div className={styles.queue}>
      <Reorder moveUp={() => {}} moveDown={() => {}} remove={() => {}}>
        <Table>
          <Table.THead>
            <Table.Row>
              <Table.TH><Trans>Project</Trans></Table.TH>
              {hasMultiplePopulations && <Table.TH><Trans>Population</Trans></Table.TH>}
              <Table.TH><Trans>Built</Trans></Table.TH>
              <Table.TH><Trans>Total</Trans></Table.TH>
              <Table.TH><Trans>Progress</Trans></Table.TH>
              <Table.TH><Trans>ETA</Trans></Table.TH>
            </Table.Row>
          </Table.THead>
          <Table.TBody>
            {colony.colony.buildQueue.map(buildQueueItem => {
              return <Table.Row key={buildQueueItem.id}>
                <Table.TD>{gameConfig.constructionProjects[buildQueueItem.constructionProjectId].name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{clientState.entities[clientState.entities[buildQueueItem.assignToPopulationId].speciesId].species.name}</Table.TD>}
                <Table.TD><FormatNumber value={buildQueueItem.completed} /></Table.TD>
                <Table.TD><FormatNumber value={buildQueueItem.total} /></Table.TD>
                <Table.TD>TODO</Table.TD>
                <Table.TD>TODO</Table.TD>
              </Table.Row>
            })}
          </Table.TBody>
          <Table.TFoot>
            <Table.Row>
              <Table.TD colSpan={hasMultiplePopulations ? 6 : 5}>
                <div className="alignEnd"><Trans>ETA: TODO</Trans></div>
              </Table.TD>
            </Table.Row>
          </Table.TFoot>
        </Table>
      </Reorder>
    </div>

    <h2 className={styles.title}><Trans>Add construction item</Trans></h2>
    <div className={styles.add}>
      <Form>
        <Form.Row columns={12}>
          <Form.Field inline width={6} columns={6}>
            <Form.Label width={2}><Trans>Structure</Trans></Form.Label>
            <Form.Select
              width={4}
              placeholder={i18n._('select.placeholder', null, {defaults: '- - Select - -'})}
              options={getConstructionOptions(faction, gameConfig, colony, i18n)}
              value={selectedAddStructureId}
              setValue={setSelectedAddStructureId}
            />
          </Form.Field>
          <Form.Field inline width={6} columns={6}>
            <Form.Label width={2}><Trans>Quantity</Trans></Form.Label>
            <Form.Input
              width={1}
              type="number"
              min={0}
              step={1}
              value={selectedAddStructureQuantity}
              setValue={setSelectedAddStructureQuantity}
            />
          </Form.Field>
        </Form.Row>
      </Form>
    </div>
  </div>;
}


function getConstructionOptions(faction, gameConfig, colony, i18n) {
  //TODO this needs to work from constructionProjects
  const availableConstructionProjectIds = getAvailableConstructionProjectIds(faction, gameConfig)

  //TODO disable IF missing required structures? Not enough minerals?
  return availableConstructionProjectIds.map(constructionProjectId => ({
    label: gameConfig.constructionProjects[constructionProjectId].name,
    value: constructionProjectId
  }));
}

function getAvailableConstructionProjectIds(faction, gameConfig) {
  const {constructionProjects} = gameConfig;
  const availableStructureIds = new Set(getAvailableStructureIds(faction, gameConfig));

  return Object.keys(constructionProjects).filter(constructionProjectId => {
    const constructionProject = constructionProjects[constructionProjectId];

    //A construction project is available if you have the tech to build all of the structures used and produced as part of the project
    return every(constructionProject.requiredStructures, (q, structureId) => availableStructureIds.has(structureId)) &&
           every(constructionProject.producedStructures, (q, structureId) => availableStructureIds.has(structureId))

  })
}

//gets a list of all structures this faction knows how to build
function getAvailableStructureIds(faction, gameConfig) {
  const {structures} = gameConfig;

  return Object.keys(structures).filter(structureId => {
    const structure = structures[structureId];

    return structure.requireTechnologyIds.every(techId => !!faction.faction.technology[techId])
  })
  //requireTechnologyIds
}
