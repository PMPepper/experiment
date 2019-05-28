import React from 'react';
import {Trans} from '@lingui/macro';
import {I18n} from '@lingui/react';
import memoize from 'memoize-one';

//Components
import { Form, Input, Button } from 'semantic-ui-react'

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';

//Other
import {CloseModalContext} from '@/components/modal/Modal';


const options = [
  { key: 'm', text: <b>Male</b>, value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]

//The component
export default class AddEditResearchGroup extends React.Component {
  static contextType = CloseModalContext;

  state = {
    facilities: {}
  };

  getResearchAreaOptions = memoize((i18n, researchAreas) => {
    //TODO deal with translations - text can be Trans object, but research areas are dynamically driven, so how to handle translations?

    return Object.keys(researchAreas).map(areaId => ({key: areaId, text: researchAreas[areaId], value: areaId}))//<option value={areaId} key={areaId}>{researchAreas[areaId]}</option>
  });


  render() {
    const {colony, gameConfig} = this.props;

    return <I18n>{({i18n}) => {
      return <Form>
        <Form.Group inline>
          <label><Trans id="addEditResearchGroup.researchArea.label">Research area</Trans></label>
          <Form.Select options={this.getResearchAreaOptions(i18n, gameConfig.researchAreas)} placeholder={i18n._('addEditResearchGroup.researchArea.placeholder', null, {defaults: '- -please select- -'})} />
        </Form.Group>

        <div role="group" aria-labelledby="addEditResearchGroup.assignedResearchFacilities.legend">
          <div id="addEditResearchGroup.assignedResearchFacilities.legend">
            <Trans id="addEditResearchGroup.assignedResearchFacilities.legend">Assigned research facilities</Trans>
          </div>
          {mapToSortedArray(
            colony.colony.structuresWithCapability.research,
            (quantity, structureId) => {
              const structure = gameConfig.structures[structureId];
              const id = `addResearchModal_structure_${structureId}`;
              const available = quantity;//TODO reduce by in-use facilities;
              const value = this.state.facilities[structureId] || 0;

              return <Form.Field inline key={structureId}>
                <label>{structure.name}</label>{/*TODO translation!*/}
                <Input type="number" id={id} min={0} max={available} step={1} />{/*value={value} onChange={(e) => {this.updateSelectedFacilities(structureId, +e.target.value)}}*/}
              </Form.Field>;
            },
            (a, b) => {return a.name > b.name ? -1 : 1},//TODO sort on translated text using locale (i18n.language),
            true
          )}
        </div>
        <Button onClick={null}>
          <Trans>Add/Edit</Trans>
        </Button>
        <Button onClick={this.context}>
          <Trans>Cancel</Trans>
        </Button>
      </Form>
    }}</I18n>

    // const {researchProject, gameConfig, faction, colony} = this.props;
    //
    // return <div className="vspaceStart">
    //   {mapToSortedArray(
    //     colony.colony.structuresWithCapability.research,
    //     (quantity, structureId) => {
    //       const structure = gameConfig.structures[structureId];
    //       const id = `addResearchModal_structure_${structureId}`;
    //       const available = quantity;//TODO reduce by in-use facilities;
    //       const value = this.state.facilities[structureId] || 0;
    //
    //       return <div key={structureId}>
    //         <label htmlFor={id}>{structure.name}</label>
    //         <input type="number" id={id} min={0} max={available} step={1} value={value} onChange={(e) => {this.updateSelectedFacilities(structureId, +e.target.value)}} />
    //       </div>;
    //     },
    //     (a, b) => {return a.name > b.name ? -1 : 1},//TODO sort on translated text using locale,
    //     true
    //   )}
    //   <div>
    //     <Button onClick={() => {alert('TODO')}}><Trans>Create</Trans></Button>
    //     <Button onClick={this.context}><Trans>Cancel</Trans></Button>
    //   </div>
    // </div>
  }

  updateSelectedFacilities = (structureId, newValue) => {
    this.setState((state) => ({facilities: {...state.facilities, [structureId]: newValue}}));
  }
}
