import React, {useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';
import {useSelector} from 'react-redux'

import styles from './windowIndustry.scss';

//Components
//import Layout, {Row, Cell} from '@/components/layout/Layout';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Table from '@/components/table/Table';
import FormatNumber from '@/components/formatNumber/FormatNumber';
import FormatDate from '@/components/formatDate/FormatDate';
import Reorder from '@/components/reorder/Reorder';
import Progress from '@/components/progress/Progress';
import Form from '@/components/form/Form';

//Hooks
import useI18n from '@/hooks/useI18n';
import {useClient} from '@/components/game/Game';

//Helpers
import forEach from '@/helpers/object/forEach';
import every from '@/helpers/object/every';
import isEmpty from '@/helpers/object/is-empty';
import sortAlphabeticalOnObjPath from '@/helpers/sorting/sort-alphabetical-on-obj-path';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';
import getETA from '@/helpers/app-ui/get-eta';
import sortStructuresByNameAndSpecies from '@/helpers/app-ui/sort-structures-by-name-and-species';
import getPopulationName from '@/helpers/app-ui/get-population-name';


//The component
export default function WindowIndustry({colonyId}) {
  const gameConfig = useSelector(state => state.game.gameConfig);
  const populations = useSelector(state => state.entitiesByType.population);
  const species = useSelector(state => state.entitiesByType.species);
  const gameTimeDate = useSelector(state => state.gameTime) * 1000;
  const colony = useSelector(state => state.game.entities[colonyId]);
  const faction = useSelector(state => state.game.entities[state.game.factionId]);

  const i18n = useI18n();
  const client = useClient();

  const hasMultiplePopulations = colony.populationIds.length > 1;
  const onlyPopulationId = hasMultiplePopulations ? null : colony.populationIds[0];

  const colonyConstructionStructures = getColonyStructuresCapabilities(colony, 'construction');

  const totalColonyConstructionFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.construction} />;

  //internal state stuff
  const [selectedAddConstructionProjectId, setSelectedAddConstructionProjectId] = useState(null);
  const [selectedAddStructureQuantity, setSelectedAddStructureQuantity] = useState(1);
  const [selectedAssignPopulationId, setSelectedAssignPopulationId] = useState(hasMultiplePopulations ? null : onlyPopulationId);
  const [selectedTakeFromPopulationId, setSelectedTakeFromPopulationId] = useState(null);

  const [selectedBuildQueueItemId, setSelectedBuildQueueItemId] = useState(null);

  const selectedAddConstructionProject = selectedAddConstructionProjectId ? gameConfig.constructionProjects[selectedAddConstructionProjectId] : null;
  const selectedAddConstructionProjectRequiresStructures = selectedAddConstructionProject && !isEmpty(selectedAddConstructionProject.requiredStructures);

  const selectedBuildQueueItem = (selectedBuildQueueItemId && colony.colony.buildQueue.find(buildQueueItem => buildQueueItem.id === selectedBuildQueueItemId)) || null;
  const selectedBuildQueueItemIndex = selectedBuildQueueItem ? colony.colony.buildQueue.indexOf(selectedBuildQueueItem) : -1;

  //Handlers
  function onClickAddConstructionProject() {
    client.addBuildQueueItem(colonyId, selectedAddConstructionProjectId, selectedAddStructureQuantity, selectedAssignPopulationId, selectedTakeFromPopulationId).then(result => {
      //build queue item added
    })
  }

  function onClickRemoveBuildQueueItem() {
    selectedBuildQueueItem && client.removeBuildQueueItem(colonyId, selectedBuildQueueItemId).then(result => {
      //build queue item is removed
    });
  }

  function onClickMoveBuildQueueItemUp() {
    client.reorderBuildQueueItem(colonyId, selectedBuildQueueItemId, selectedBuildQueueItemIndex - 1).then(result => {
      //build queue item is reordered
    });
  }

  function onClickMoveBuildQueueItemDown() {
    client.reorderBuildQueueItem(colonyId, selectedBuildQueueItemId, selectedBuildQueueItemIndex + 1).then(result => {
      //build queue item is reordered
    });
  }

  let etaDate = new Date(gameTimeDate)

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
            .sort(sortStructuresByNameAndSpecies(i18n.language, populations, species, gameConfig))
            .filter(({quantity}) => (quantity > 0))
            .map(({populationId, structureId, quantity}) => {
              const availableFormatted = <FormatNumber value={+quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'construction', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{getPopulationName(populationId, populations, species)}</Table.TD>}
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
      <Reorder
        moveUp={onClickMoveBuildQueueItemUp}
        moveDown={onClickMoveBuildQueueItemDown}
        remove={onClickRemoveBuildQueueItem}
        disableMoveUp={!selectedBuildQueueItem || (selectedBuildQueueItemIndex === 0)}
        disableMoveDown={!selectedBuildQueueItem || (selectedBuildQueueItemIndex === colony.colony.buildQueue.length - 1)}
        disableRemove={!selectedBuildQueueItem}
      >
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
            {colony.colony.buildQueue.map((buildQueueItem, index) => {
              const currentConstructionProject = gameConfig.constructionProjects[buildQueueItem.constructionProjectId];
              const isFirstOfType = !colony.colony.buildQueue.slice(0, index).some(currentBuildQueueItem => (currentBuildQueueItem.constructionProjectId === buildQueueItem.constructionProjectId));
              const progress = +buildQueueItem.completed + (isFirstOfType ? (colony.colony.buildInProgress[buildQueueItem.constructionProjectId] || 0) / currentConstructionProject.bp : 0);

              //fromDate, cost, progress, rate
              etaDate = getETA(
                etaDate,
                currentConstructionProject.bp * buildQueueItem.total,
                currentConstructionProject.bp * progress,
                colony.colony.capabilityProductionTotals.construction
              );

              return <Table.Row key={buildQueueItem.id} highlighted={selectedBuildQueueItemId === buildQueueItem.id} className={styles.selectable} onClick={() => {setSelectedBuildQueueItemId(buildQueueItem.id)}}>
                <Table.TD>{currentConstructionProject.name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{getPopulationName(buildQueueItem.assignToPopulationId, populations, species)}</Table.TD>}
                <Table.TD><FormatNumber value={+buildQueueItem.completed} /></Table.TD>
                <Table.TD><FormatNumber value={+buildQueueItem.total} /></Table.TD>
                <Table.TD><Progress value={progress} max={+buildQueueItem.total} thin /></Table.TD>
                <Table.TD><FormatDate value={etaDate} format="date" /></Table.TD>
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
              options={getPopulationOptions(colony.populationIds, populations, species, i18n)}
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
                populations,
                species,
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


function getPopulationOptions(populationIds, populations, species, i18n, disabledFilter = null) {
  return populationIds
    .map(populationId => ({
      label: getPopulationName(populationId, populations, species),
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
      &&
      isEmpty(gameConfig.constructionProjects[constructionProjectId].shipyard)
    )
    .map(constructionProjectId => ({
      label: gameConfig.constructionProjects[constructionProjectId].name,
      value: constructionProjectId
    }))
    .sort(sortFunc)

  const upgradeProjects = availableConstructionProjectIds
    .filter(constructionProjectId =>
      !isEmpty(gameConfig.constructionProjects[constructionProjectId].requiredStructures)
      &&
      isEmpty(gameConfig.constructionProjects[constructionProjectId].shipyard)
    )
    .map(constructionProjectId => ({
      label: gameConfig.constructionProjects[constructionProjectId].name,
      value: constructionProjectId
    }))
    .sort(sortFunc)

  const shipyards = availableConstructionProjectIds
    .filter(constructionProjectId => !isEmpty(gameConfig.constructionProjects[constructionProjectId].shipyard))
    .map(constructionProjectId => ({
      label: gameConfig.constructionProjects[constructionProjectId].name,
      value: constructionProjectId
    }))
    .sort(sortFunc)

  const options = [
    {
      label: i18n._('Construction projects'),
      key: 'build',
      options: buildProjects
    },
    {
      label: i18n._('Upgrade projects'),
      key: 'upgrade',
      options: upgradeProjects
    },
    {
      label: i18n._('Shipyards'),
      key: 'shipyards',
      options: shipyards
    }
  ].filter(optGroup => optGroup.options.length > 0);

  if(options === 1) {
    return options[0].options;
  }

  return options;
}

function getAvailableConstructionProjectIds(faction, gameConfig) {
  const {constructionProjects} = gameConfig;
  const availableStructureIds = new Set(getAvailableStructureIds(faction, gameConfig));

  return Object.keys(constructionProjects).filter(constructionProjectId => {
    const constructionProject = constructionProjects[constructionProjectId];

    //A construction project is available if you have the tech to build all of the structures used and produced as part of the project
    return every(constructionProject.requiredStructures || {}, (q, structureId) => availableStructureIds.has(structureId)) &&
           every(constructionProject.producedStructures || {}, (q, structureId) => availableStructureIds.has(structureId))

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
