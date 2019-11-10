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
import {useClient} from '@/components/game/Game';

//Helpers
import forEach from '@/helpers/object/forEach';
import every from '@/helpers/object/every';
import isEmpty from '@/helpers/object/isEmpty';
import sortAlphabeticalOnObjPath from '@/helpers/sorting/sort-alphabetical-on-obj-path';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';
import sortStructuresByNameAndSpecies from '@/helpers/app-ui/sort-structures-by-name-and-species';


//The component
export default function WindowIndustry({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));

  const i18n = useI18n();
  const client = useClient();

  const gameConfig = clientState.initialGameState;
  //const researchAreas = gameConfig.researchAreas;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const hasMultiplePopulations = colony.populationIds.length > 1;
  const onlyPopulationId = hasMultiplePopulations ? null : colony.populationIds[0];

  const colonyConstructionStructures = getColonyStructuresCapabilities(colony, 'construction');

  const totalColonyConstructionFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.construction} />;

  //internal state stuff
  const [selectedAddConstructionProjectId, setSelectedAddConstructionProjectId] = useState(null);
  const [selectedAddStructureQuantity, setSelectedAddStructureQuantity] = useState(1);
  const [selectedAssignPopulationId, setSelectedAssignPopulationId] = useState(hasMultiplePopulations ? null : onlyPopulationId);
  const [selectedTakeFromPopulationId, setSelectedTakeFromPopulationId] = useState(null);

  const selectedAddConstructionProject = selectedAddConstructionProjectId ? gameConfig.constructionProjects[selectedAddConstructionProjectId] : null;
  const selectedAddConstructionProjectRequiresStructures = selectedAddConstructionProject && !isEmpty(selectedAddConstructionProject.requiredStructures);


  //Handlers
  function onClickAddConstructionProject() {
    client.addBuildQueueItem(colonyId, selectedAddConstructionProjectId, selectedAddStructureQuantity, selectedAssignPopulationId, selectedTakeFromPopulationId).then(result => {
      //build queue item added
    })
  }

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
            .sort(sortStructuresByNameAndSpecies(i18n.language, clientState.entities, gameConfig))
            .map(({populationId, structureId, quantity}) => {
              const availableFormatted = <FormatNumber value={+quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'construction', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{clientState.entities[clientState.entities[populationId].speciesId].species.name}</Table.TD>}
                <Table.TD><Trans>{availableFormatted}</Trans></Table.TD>
                <Table.TD><FormatNumber value={+rps} /></Table.TD>
              </Table.Row>
            })
          }
        </Table.TBody>
        <Table.TFoot>
          <Table.Row>
            <Table.TD colSpan={hasMultiplePopulations ? 4 : 3}>
              <div className="alignEnd"><Trans>Colony total BP: {totalColonyConstructionFormatted}</Trans></div>
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
                <Table.TD><FormatNumber value={+buildQueueItem.completed} /></Table.TD>
                <Table.TD><FormatNumber value={+buildQueueItem.total} /></Table.TD>
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
          <Form.Field inline width={10} columns={10}>
            <Form.Label width={2}><Trans>Project</Trans></Form.Label>
            <Form.Select
              width={8}
              placeholder={i18n._('select.placeholder', null, {defaults: '- - Select - -'})}
              options={getConstructionOptions(faction, gameConfig, colony, i18n)}
              value={selectedAddConstructionProjectId}
              setValue={setSelectedAddConstructionProjectId}
            />
          </Form.Field>
          <Form.Field inline width={2} columns={2}>
            <Form.Label width={1}><Trans>Quantity</Trans></Form.Label>
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
        {(hasMultiplePopulations || (selectedAddConstructionProject && selectedAddConstructionProject.requiredStructures)) && <Form.Row columns={12}>
          {hasMultiplePopulations && <Form.Field inline width={6} columns={6}>
            <Form.Label width={2}><Trans>Assign to</Trans></Form.Label>
            <Form.Select
              width={4}
              placeholder={i18n._('select.placeholder', null, {defaults: '- - Select - -'})}
              options={getPopulationOptions(colony.populationIds, clientState, i18n)}
              value={selectedAssignPopulationId}
              setValue={setSelectedAssignPopulationId}
            />
          </Form.Field>}

          {selectedAddConstructionProject && !isEmpty(selectedAddConstructionProject.requiredStructures) && <Form.Field width={6} columns={6} inline>
            <Form.Label width={2}><Trans>Take from</Trans></Form.Label>
            <Form.Select
              width={4}
              placeholder={i18n._('select.placeholder', null, {defaults: '- - Select - -'})}
              options={getPopulationOptions(
                colony.populationIds,
                clientState,
                i18n,
                populationId => {
                  //does this population have the prerequisites to do this project?
                  return !every(selectedAddConstructionProject.requiredStructures, (qty, requiredStructureId) => {
                    return ((colony.colony.structures[populationId] || {})[requiredStructureId] || 0) > qty
                  })
                })}
              value={selectedTakeFromPopulationId}
              setValue={setSelectedTakeFromPopulationId}
            />
          </Form.Field>}
        </Form.Row>}
        <Form.Row columns={12}>
          <Form.Field width={6} columns={6} inline>
            <Form.Label width={2}><Trans>Minerals required</Trans></Form.Label>
            <Form.Output width={4}>-</Form.Output>
          </Form.Field>
          <Form.Field width={4} columns={4} inline>
            <Form.Label width={2}><Trans>Construction time</Trans></Form.Label>
            <Form.Output width={2}>{(selectedAddConstructionProject && selectedAddStructureQuantity > 0) ?
              <Trans>{Math.ceil((selectedAddStructureQuantity * selectedAddConstructionProject.bp) / colony.colony.capabilityProductionTotals.construction)} days</Trans>
              :
              <Trans id="valueUnknown">-</Trans>
            }</Form.Output>
          </Form.Field>
          <Form.Button
            width={2}
            onClick={onClickAddConstructionProject}
            disabled={!selectedAddConstructionProject || selectedAddStructureQuantity < 1 || !selectedAssignPopulationId || (selectedAddConstructionProjectRequiresStructures && !selectedTakeFromPopulationId)}
          >
            <Trans>Add</Trans>
          </Form.Button>
        </Form.Row>
      </Form>
    </div>
  </div>;
}


function getPopulationOptions(populationIds, clientState, i18n, disabledFilter = null) {
  return populationIds
    .map(populationId => ({
      label: clientState.entities[clientState.entities[populationId].speciesId].species.name,
      value: populationId,
      disabled: disabledFilter ? disabledFilter(populationId) : false
    }))
    .sort(sortAlphabeticalOnObjPath('label', i18n.language))
}

function getConstructionOptions(faction, gameConfig, colony, i18n) {
  const availableConstructionProjectIds = getAvailableConstructionProjectIds(faction, gameConfig);
  const sortFunc = sortAlphabeticalOnObjPath('label', i18n.language);

  const buildProjects = availableConstructionProjectIds
    .filter(constructionProjectId =>
      isEmpty(gameConfig.constructionProjects[constructionProjectId].requiredStructures)
    )
    .map(constructionProjectId => ({
      label: gameConfig.constructionProjects[constructionProjectId].name,
      value: constructionProjectId
    }))
    .sort(sortFunc)

  const upgradeProjects = availableConstructionProjectIds
    .filter(constructionProjectId =>
      !isEmpty(gameConfig.constructionProjects[constructionProjectId].requiredStructures)
    )
    .map(constructionProjectId => ({
      label: gameConfig.constructionProjects[constructionProjectId].name,
      value: constructionProjectId
    }))
    .sort(sortFunc)

  if(buildProjects.length > 0 && upgradeProjects.length > 0) {
    return [
      {
        label: i18n._('Construction projects'),
        key: 'build',
        options: buildProjects
      },
      {
        label: i18n._('Upgrade projects'),
        key: 'upgrade',
        options: upgradeProjects
      }
    ];
  }

  if(buildProjects.length > 0) {
    return buildProjects;
  }

  return upgradeProjects;
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
