import React, {useContext, useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

//Components
import Form from '@/components/form/Form';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import LocalTableState from '@/components/datatable/LocalTableState';
import ResearchQueueProjects from '@/components/game/tables/ResearchQueueProjects';
//import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
import filter from '@/helpers/object/filter';
import formatNumber from '@/helpers/string/format-number';

//Other
import {CloseModalContext} from '@/components/modal/Modal';


//The component
export default function AddEditResearchQueue({faction, colony, clientState, initialResearchQueue}) {
  const i18n = useI18n();
  const close = useContext(CloseModalContext);
  const [structures, setStructures] = useState({...initialResearchQueue.structures});
  const [researchIds, setResearchIds] = useState([...initialResearchQueue.researchIds]);

  const [selectedResearchId, setSelectedResearchId] = useState('');

  const addSelectedResearchToQueue = useCallback(() => {
    selectedResearchId && setResearchIds([...researchIds, selectedResearchId])
  }, [researchIds, setResearchIds, selectedResearchId])

  const gameConfig = clientState.initialGameState;

  return <div>
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
                <Form.Label width={2}>{structure.name}</Form.Label>{/*TODO translation!*/}
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
      </Form.Group>

      <Form.Group>
        <Form.Legend>
          <Trans id="addEditResearchQueue.researchProjects.legend">Research projects</Trans>
        </Form.Legend>
        <Form.Container>
          <LocalTableState //TODO table sorting controls
            rows={researchIds.map(researchId => {
              const research = gameConfig.research[researchId];
              //TODO progress
              //TODO ETA

              return {
                ...research
              };
            })}
            extras={{}}
          >
            <ResearchQueueProjects />
          </LocalTableState>
        </Form.Container>
        <Form.Group>
          <Form.Legend>
            <Trans>Research project</Trans>
          </Form.Legend>
          <Form.Row columns={12}>
            <Form.Field width={10} columns={10} inline>
              <Form.Label width={4}><Trans>Add research project</Trans></Form.Label>
              <Form.Select
                width={6}
                placeholder={i18n._('select.placeholder', null, {defaults: '- - Select - -'})}
                options={getResearchOptions(i18n, faction, gameConfig, researchIds)}
                value={selectedResearchId}
                setValue={setSelectedResearchId}
              />
            </Form.Field>
            <Form.Button width={2} onClick={addSelectedResearchToQueue}>
              <Trans>Add</Trans>
            </Form.Button>
          </Form.Row>
        </Form.Group>
      </Form.Group>
    </Form>

    <Buttons>
      <Button onClick={null}>
        <Trans>Add/Edit</Trans>
      </Button>
      <Button onClick={close}>
        <Trans>Cancel</Trans>
      </Button>
    </Buttons>
  </div>
}


function getResearchOptions (i18n, faction, gameConfig, excludeResearchIds) {
  //TODO deal with translations - text can be Trans object, but research areas are dynamically driven, so how to handle translations?

  return Object.keys(gameConfig.researchAreas)
    .map(areaId => ({
      key: areaId,
      label: gameConfig.researchAreas[areaId],
      options: mapToSortedArray(
        getAvailableProjectsInArea(areaId, faction, gameConfig, excludeResearchIds),
        (research, researchId) => {
          const researchCost = formatNumber(research.cost, 0, i18n.language, null);

          return {
            label: i18n._(`research.${researchId}`, {name: research.name, cost: researchCost}, {defaults: '{name}: {cost} RP'}),
            value: researchId
          }
        },
        (a, b) => {return a.label > b.label ? -1 : 1},//TODO sort using locale
      )
    }))
}

//TODO exclude projects already in queue
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





// import {I18n} from '@lingui/react';
// import memoize from 'memoize-one';
//
// //Components
// //import { Form, Input, Button } from 'semantic-ui-react'
// import Form from '@/components/form/Form';
// import Button from '@/components/button/Button';
//
// //Helpers
// import mapToSortedArray from '@/helpers/object/map-to-sorted-array';
//
// //Other
// import {CloseModalContext} from '@/components/modal/Modal';
//
//
//
//
// //The component
// export default class AddEditResearchGroup extends React.Component {
//   static contextType = CloseModalContext;
//
//   state = {
//     facilities: {}
//   };
//
//   getResearchAreaOptions = memoize((i18n, researchAreas) => {
//     //TODO deal with translations - text can be Trans object, but research areas are dynamically driven, so how to handle translations?
//
//     return Object.keys(researchAreas).map(areaId => ({key: areaId, label: researchAreas[areaId], value: areaId}))//<option value={areaId} key={areaId}>{researchAreas[areaId]}</option>
//   });
//
//
//   render() {
//     const {colony, gameConfig} = this.props;
//
//     return <I18n>{({i18n}) => {
//       if(!colony.colony.structuresWithCapability.research) {
//         //this colony cannot do any research
//         return '[TODO Colony incapable of research!]';
//       }
//
//
//       return <Form name="addEditResearchGroup">
//         <Form.Group inline>
//           <label><Trans id="addEditResearchGroup.researchArea.label">Research area</Trans></label>
//           <Form.Select options={this.getResearchAreaOptions(i18n, gameConfig.researchAreas)} placeholder={i18n._('addEditResearchGroup.researchArea.placeholder', null, {defaults: '- -please select- -'})} />
//         </Form.Group>
//
//         <div role="group" aria-labelledby="addEditResearchGroup.assignedResearchFacilities.legend">
//           <div id="addEditResearchGroup.assignedResearchFacilities.legend">
//             <Trans id="addEditResearchGroup.assignedResearchFacilities.legend">Assigned research facilities</Trans>
//           </div>
//           {mapToSortedArray(
//             colony.colony.structuresWithCapability.research,
//             (quantity, structureId) => {
//               const structure = gameConfig.structures[structureId];
//               const id = `addResearchModal_structure_${structureId}`;
//               const available = quantity;//TODO reduce by in-use facilities;
//               const value = this.state.facilities[structureId] || 0;
//
//               return <Form.Field inline key={structureId}>
//                 <label>{structure.name}</label>{/*TODO translation!*/}
//                 <Form.Input type="number" id={id} min={0} max={available} step={1} value={value} onChange={(e) => {this.updateSelectedFacilities(structureId, +e.target.value)}} />
//               </Form.Field>;
//             },
//             (a, b) => {return a.name > b.name ? -1 : 1},//TODO sort on translated text using locale (i18n.language),
//             true
//           )}
//         </div>
//         <Button onClick={null}>
//           <Trans>Add/Edit</Trans>
//         </Button>
//         <Button onClick={this.context}>
//           <Trans>Cancel</Trans>
//         </Button>
//       </Form>
//     }}</I18n>
//
//     // const {researchProject, gameConfig, faction, colony} = this.props;
//     //
//     // return <div className="vspaceStart">
//     //   {mapToSortedArray(
//     //     colony.colony.structuresWithCapability.research,
//     //     (quantity, structureId) => {
//     //       const structure = gameConfig.structures[structureId];
//     //       const id = `addResearchModal_structure_${structureId}`;
//     //       const available = quantity;//TODO reduce by in-use facilities;
//     //       const value = this.state.facilities[structureId] || 0;
//     //
//     //       return <div key={structureId}>
//     //         <label htmlFor={id}>{structure.name}</label>
//     //         <input type="number" id={id} min={0} max={available} step={1} value={value} onChange={(e) => {this.updateSelectedFacilities(structureId, +e.target.value)}} />
//     //       </div>;
//     //     },
//     //     (a, b) => {return a.name > b.name ? -1 : 1},//TODO sort on translated text using locale,
//     //     true
//     //   )}
//     //   <div>
//     //     <Button onClick={() => {alert('TODO')}}><Trans>Create</Trans></Button>
//     //     <Button onClick={this.context}><Trans>Cancel</Trans></Button>
//     //   </div>
//     // </div>
//   }
//
//   updateSelectedFacilities = (structureId, newValue) => {
//     this.setState((state) => ({facilities: {...state.facilities, [structureId]: newValue}}));
//   }
// }
