import React, {useContext, useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

//Components
import Form from '@/components/form/Form';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import LocalTableState from '@/components/datatable/LocalTableState';
import ResearchQueueProjects from '@/components/game/tables/ResearchQueueProjects';
import DatatableSort from '@/components/datatableSort/DatatableSort';
import ExpandedRowContent from '@/components/datatable/ExpandedRowContent';

//Hooks
import useI18n from '@/hooks/useI18n';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import filter from '@/helpers/object/filter';
import reduce from '@/helpers/object/reduce';
import formatNumber from '@/helpers/string/format-number';

//Other
import {CloseModalContext} from '@/components/modal/Modal';
import {DAY_ANNUAL_FRACTION} from '@/game/Consts';

const blankReserchQueue = {structures: {}, researchIds: []};


//The component
export default function AddEditResearchQueue({faction, colony, clientState, initialResearchQueue = blankReserchQueue}) {
  const i18n = useI18n();
  const close = useContext(CloseModalContext);
  const [structures, setStructures] = useState({...initialResearchQueue.structures});
  const [researchIds, setResearchIds] = useState([...initialResearchQueue.researchIds]);
  const [isEditing] = useState(initialResearchQueue !== blankReserchQueue);

  const [selectedAvailableResearchId, setSelectedAvailableResearchId] = useState('');
  const [selectedQueuedResearchId, setSelectedQueuedResearchId] = useState(null)

  const onQueuedResearchSelected = useCallback((researchId, isSelected) => {
    setSelectedQueuedResearchId(isSelected ? researchId : null);
  }, [setSelectedQueuedResearchId]);

  const addSelectedResearchToQueue = useCallback(() => {
    if(selectedAvailableResearchId) {
      setResearchIds([...researchIds, selectedAvailableResearchId]);
      setSelectedAvailableResearchId('');
    }
  }, [researchIds, setResearchIds, selectedAvailableResearchId, setSelectedAvailableResearchId])

  const onMoveUpSelectedResearch = useCallback(() => {
    if(researchIds.length > 1 && selectedQueuedResearchId) {
      const index = researchIds.indexOf(selectedQueuedResearchId);

      if(index > 0) {
        setResearchIds([
          ...researchIds.slice(0, index - 1),
          researchIds[index],
          researchIds[index - 1],
          ...researchIds.slice(index + 1)
        ])
      }
    }
  }, [researchIds, setResearchIds, selectedQueuedResearchId]);

  const onMoveDownSelectedResearch = useCallback(() => {
    if(researchIds.length > 1 && selectedQueuedResearchId) {
      const index = researchIds.indexOf(selectedQueuedResearchId);

      if(index < researchIds.length - 1) {
        setResearchIds([
          ...researchIds.slice(0, index),
          researchIds[index+1],
          researchIds[index],
          ...researchIds.slice(index + 2)
        ])
      }
    }
  }, [researchIds, setResearchIds, selectedQueuedResearchId]);

  const onRemoveSelectedResearch = useCallback(() => {
    if(selectedQueuedResearchId) {
      const index = researchIds.indexOf(selectedQueuedResearchId);

      if(index != -1) {
        setResearchIds([
          ...researchIds.slice(0, index),
          ...researchIds.slice(index + 1)
        ])
      }
    }
  }, [researchIds, setResearchIds, selectedQueuedResearchId]);

  const gameConfig = clientState.initialGameState;

  //calculate researchRate based on selected facilities
  const researchRate = reduce(structures, (total, structureCount, structureId) => {
    const structure = gameConfig.structures[structureId];

    return total + (structureCount * structure.capabilities.research)
  }, 0);

  //used to keep track of ETAs of research projects in this queue
  const currentDate = new Date(clientState.gameTimeDate)

  return <div className="vspaceStart">
    <Form>
      <Form.Group>
        <Form.Legend>
          <Trans id="addEditResearchQueue.assignedResearchFacilities.legend">Assigned research facilities</Trans>
        </Form.Legend>
        {mapToSortedArray(
          colony.colony.structuresWithCapability.research,
          (quantity, structureId) => {
            const structure = gameConfig.structures[structureId];
            const available = quantity;//TODO reduce by in-use facilities;
            const value = structures[structureId] || 0;

            return <Form.Row key={structureId}>
              <Form.Field columns={6} inline>
                <Form.Label width={2}>{structure.name}</Form.Label>{/*TODO translation!?*/}
                <Form.Input width={1} type="number" min={0} max={available} step={1} value={value} setValue={(newValue) => {
                  setStructures({
                    ...structures,
                    [structureId]: +newValue
                  });
                }} />
                / {available}
              </Form.Field>
            </Form.Row>;
          },
          (a, b) => {return a.name > b.name ? -1 : 1},//TODO sort on translated text using locale (i18n.language),
          true
        )}
        <Form.Row>
          <Form.Field columns={6} inline>
            <Form.Label width={2}>
              <Trans>Total research rate</Trans>
            </Form.Label>
            <Form.Output width={1}>{researchRate}</Form.Output>
          </Form.Field>
        </Form.Row>
      </Form.Group>

      <Form.Group>
        <Form.Legend>
          <Trans id="addEditResearchQueue.researchProjects.legend">Queued research projects</Trans>
        </Form.Legend>
        <Form.Container>
          <LocalTableState
            rows={researchIds.reduce((obj, researchId, index) => {
              const research = gameConfig.research[researchId];
              const progress = colony.colony.researchInProgress[researchId] || 0;

              //ETA
              if(researchRate > 0) {
                const days = Math.ceil((research.cost - progress) / (researchRate * DAY_ANNUAL_FRACTION));

                //now add days to 'current date'
                currentDate.setDate(currentDate.getDate() + days)
              }

              obj[researchId] = {
                ...research,
                progress,
                eta: researchRate > 0 ? new Date(currentDate) : '-',
                index: index + 1
              };

              return obj;
            }, {})}
            itemsPerPage={5}

            setRowSelected={onQueuedResearchSelected}
            selectedRows={selectedQueuedResearchId ? {[selectedQueuedResearchId]: true} : {}}
            clickTogglesSelectedRows={true}

            moveUp={onMoveUpSelectedResearch}
            moveDown={onMoveDownSelectedResearch}
            remove={onRemoveSelectedResearch}
          >
            <DatatableSort>
              <ResearchQueueProjects addExpandRowColumn={true} getExpandedRowContents={(row) => {return <ExpandedRowContent>{row.data.description}</ExpandedRowContent>}} />
              {researchIds.length === 0 && <p className="alignCenter bodyCopy"><Trans>No research in queue</Trans></p>}
            </DatatableSort>
          </LocalTableState>
        </Form.Container>
        <Form.Group>
          <Form.Legend>
            <Trans>Add research project to queue</Trans>
          </Form.Legend>
          <Form.Row columns={12}>
            <Form.Field width={10} columns={10} inline>
              <Form.Label width={4}><Trans>Available research projects</Trans></Form.Label>
              <Form.Select
                width={6}
                placeholder={i18n._('select.placeholder', null, {defaults: '- - Select - -'})}
                options={getResearchOptions(i18n, faction, gameConfig, researchIds, colony.colony.researchInProgress)}
                value={selectedAvailableResearchId}
                setValue={setSelectedAvailableResearchId}
              />
            </Form.Field>
            <Form.Button width={2} onClick={addSelectedResearchToQueue}>
              <Trans>Add</Trans>
            </Form.Button>
          </Form.Row>
          <Form.Row>
            <Form.Field columns={12} inline>
              <Form.Label width={4}><Trans>Description</Trans></Form.Label>
              <Form.Textarea width={8} value={selectedAvailableResearchId ? gameConfig.research[selectedAvailableResearchId].description : ''} rows="6" />
            </Form.Field>
          </Form.Row>
        </Form.Group>
      </Form.Group>
    </Form>

    <Buttons position="right">
      <Button onClick={null}>
        {isEditing ?
          <Trans>Edit</Trans>
          :
          <Trans>Add</Trans>
        }
      </Button>
      <Button onClick={close}>
        <Trans>Cancel</Trans>
      </Button>
    </Buttons>
  </div>
}


function getResearchOptions(i18n, faction, gameConfig, excludeResearchIds, researchInProgress) {
  //TODO deal with translations - text can be Trans object, but research areas are dynamically driven, so how to handle translations?

  return Object.keys(gameConfig.researchAreas)
    .map(areaId => ({
      key: areaId,
      label: gameConfig.researchAreas[areaId],
      options: mapToSortedArray(
        getAvailableProjectsInArea(areaId, faction, gameConfig, excludeResearchIds),
        (research, researchId) => {
          const progress = researchInProgress[researchId] || 0;
          const researchCost = formatNumber(research.cost - progress, 0, i18n.language, null);

          return {
            label: i18n._(`research.${researchId}`, {name: research.name, cost: researchCost}, {defaults: '{name}: {cost} RP'}),
            value: researchId
          }
        },
        (a, b) => {return a.label > b.label ? -1 : 1},//TODO sort using locale
      )
    }))
}

function getAvailableProjectsInArea(areaId, faction, gameConfig, excludeResearchIds) {
  areaId = `${areaId}`;

  const factionCompletedResearch = faction.faction.research;

  return filter(gameConfig.research, (research, researchId) => (
    `${research.area}` === areaId &&//is in selected area
    !factionCompletedResearch[researchId] &&//is not already researched
    !excludeResearchIds.includes(researchId) &&//is not in the exclude list
    research.requireResearchIds.every(requiredResearchId => factionCompletedResearch[requiredResearchId])//are all prerequisites completed?
  ))
}
