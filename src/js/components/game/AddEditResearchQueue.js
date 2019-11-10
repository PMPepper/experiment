import React, {useContext, useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

//Components
import Form from '@/components/form/Form';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import LocalTableState from '@/components/datatable/LocalTableState';
import ResearchQueueProjects from '@/components/game/tables/ResearchQueueProjects';
import Reorder from '@/components/reorder/Reorder';
import ExpandedRowContent from '@/components/datatable/ExpandedRowContent';
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import filter from '@/helpers/object/filter';
import reduce from '@/helpers/object/reduce';
import modify from '@/helpers/object/modify';
import add from '@/helpers/array/add';
import formatNumber from '@/helpers/string/format-number';
import getResearchProductionFromStructures from '@/helpers/app/getResearchProductionFromStructures';
import getResearchETA from '@/helpers/app/getResearchETA';
import sortAlphabeticalOnMappedProp from '@/helpers/sorting/sort-alphabetical-on-mapped-prop';

//Other
import {CloseModalContext} from '@/components/modal/Modal';


//The component
export default function AddEditResearchQueue({faction, colony, clientState, onComplete, researchQueue}) {
  const i18n = useI18n();
  const close = useContext(CloseModalContext);
  const [structures, setStructures] = useState(researchQueue ? {...researchQueue.researchQueue.structures} : {});
  const [researchIds, setResearchIds] = useState(researchQueue ? [...researchQueue.researchQueue.researchIds] : []);
  const [isEditing] = useState(!!researchQueue);

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

  //research projects that can't be added to the queue:
  //...things in this queue already
  const excludeResearchIds = [...researchIds];

  //...things already in another queue
  colony.researchQueueIds.forEach(researchQueueId => {
    const currentResearchQueue = clientState.entities[researchQueueId];

    if(currentResearchQueue !== researchQueue) {
      add(excludeResearchIds, currentResearchQueue.researchQueue.researchIds);
    }
  })

  //calculate researchRate based on selected facilities
  const gameConfig = clientState.initialGameState;

  //{[populationId]: {[capability]: {[structureId]: quantity}}}
  const researchRate = getResearchProductionFromStructures(structures, colony);

  //used to keep track of ETAs of research projects in this queue
  let currentDate = new Date(clientState.gameTimeDate)


  return <div className="vspaceStart">
    <Form>
      <Form.Group>
        <Form.Legend>
          <Trans id="addEditResearchQueue.assignedResearchFacilities.legend">Assigned research facilities</Trans>
        </Form.Legend>
        {[0, ...colony.populationIds]
          .filter(populationId => {
            //filter out populations that can't do this capability
            return colony.colony.populationCapabilityProductionTotals[populationId].research > 0
          })
          .map(populationId => {
            //map to population object
            return clientState.entities[populationId]
          })
          .sort((a, b) => {
            //TODO translations
            const aName = clientState.entities[a.speciesId].species.name;
            const bName = clientState.entities[b.speciesId].species.name;

            //TODO sort using locale-aware natsort
            return aName > bName ? -1 : 1
          })
          .map(population => {
            const name = clientState.entities[population.speciesId].species.name;

            return <Form.Group key={population.id}>
              <Form.Legend>{name}</Form.Legend>
              {mapToSortedArray(
                filter(colony.colony.populationStructuresWithCapability[population.id].research, (qty, structureId) => (qty > 0)),
                (quantity, structureId) => {
                  const structure = gameConfig.structures[structureId];

                  //how may of this population/structure are in use by another research queue on this colony?
                  const inUse = colony.researchQueueIds.reduce((total, researchQueueId) => {
                    const currentResearchQueue = clientState.entities[researchQueueId];

                    if(currentResearchQueue !== researchQueue) {
                      total += currentResearchQueue.researchQueue.structures[population.id] ?
                        currentResearchQueue.researchQueue.structures[population.id][structureId] || 0
                        :
                        0;
                    }

                    return total;
                  }, 0);

                  const available = quantity - inUse;//reduce by in-use facilities;
                  const value = (structures[population.id] && structures[population.id][structureId]) || 0;

                  const rpPerFacility = colony.colony.populationUnitCapabilityProduction[population.id].research[structureId];
                  const rpPerFacilityFormatted = <FormatNumber value={rpPerFacility} />

                  return <Form.Row key={structureId}>
                    <Form.Field columns={6} inline>
                      <Form.Label width={2}>{structure.name} ({rpPerFacilityFormatted}RP)</Form.Label>{/*TODO translation!?*/}
                      <Form.Input width={1} type="number" min={0} max={available} step={1} value={value} setValue={(newValue) => {
                        setStructures(modify(structures, [population.id, structureId], +newValue, (index, path) => {return {};}));
                      }} />
                      / {available}
                    </Form.Field>
                  </Form.Row>;
                },
                sortAlphabeticalOnMappedProp((structureId) => {
                  //TODO translations
                  return gameConfig.structures[structureId].name
                }, i18n.language),
                false,
                true//sort on keys
              )}
            </Form.Group>
          })
        }
        <Form.Row>
          <Form.Field columns={12} inline>
            <Form.Label width={4}>
              <Trans>Total research rate</Trans>
            </Form.Label>
            <Form.Output width={3}>{researchRate} <Trans>RP per year</Trans></Form.Output>
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

              if(faction.faction.research[researchId]) {
                return obj;//this project is complete - do not show in table
              }

              //ETA
              const researchETA = getResearchETA(currentDate, research.cost, progress, researchRate)

              obj[researchId] = {
                ...research,
                progress,
                eta: researchETA || '-',
                index: Object.keys(obj).length + 1
              };

              //update current date
              currentDate = new Date(researchETA);

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
            <Reorder>
              <ResearchQueueProjects addExpandRowColumn={true} getExpandedRowContents={(row) => {return <ExpandedRowContent>{row.data.description}</ExpandedRowContent>}} />
              {researchIds.length === 0 && <p className="alignCenter bodyCopy"><Trans>No research in queue</Trans></p>}
            </Reorder>
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
                options={getResearchOptions(i18n, faction, gameConfig, excludeResearchIds, colony.colony.researchInProgress)}
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
      <Button onClick={() => {onComplete(structures, researchIds)}}>
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
