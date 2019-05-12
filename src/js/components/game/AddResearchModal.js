import React from 'react';
import {Trans} from "@lingui/macro";

//Components
import Button from '@/components/button/Button';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';

//Other
import {CloseModalContext} from '@/components/modal/Modal';


//The component
export default class AddResearchModal extends React.Component {
  static contextType = CloseModalContext;

  state = {
    facilities: {}
  };


  render() {
    const {researchProject, gameConfig, faction, colony} = this.props;

    return <div className="vspaceStart">
      {mapToSortedArray(
        colony.colony.structuresWithCapability.research,
        (quantity, structureId) => {
          const structure = gameConfig.structures[structureId];
          const id = `addResearchModal_structure_${structureId}`;
          const available = quantity;//TODO reduce by in-use facilities;
          const value = this.state.facilities[structureId] || 0;

          return <div key={structureId}>
            <label htmlFor={id}>{structure.name}</label>
            <input type="number" id={id} min={0} max={available} step={1} value={value} onChange={(e) => {this.updateSelectedFacilities(structureId, +e.target.value)}} />
          </div>;
        },
        (a, b) => {return a.name > b.name ? -1 : 1},//TODO sort on translated text using locale,
        true
      )}
      <div>
        <Button onClick={() => {alert('TODO')}}><Trans>Create</Trans></Button>
        <Button onClick={this.context}><Trans>Cancel</Trans></Button>
      </div>
    </div>

    return 'TODO AddResearchModal';
  }

  updateSelectedFacilities = (structureId, newValue) => {
    this.setState((state) => ({facilities: {...state.facilities, [structureId]: newValue}}));
  }
}
