import React from 'react';
import {Trans} from '@lingui/macro';
import {I18n} from '@lingui/react';
import memoize from 'memoize-one';

//Components
//import { Form, Input, Button } from 'semantic-ui-react'
import Form from '@/components/form/Form';
import Button from '@/components/button/Button';

//Helpers
import mapToSortedArray from '@/helpers/object/map-to-sorted-array';

//Other
import {CloseModalContext} from '@/components/modal/Modal';




//The component
export default class AddEditResearchGroup extends React.Component {
  static contextType = CloseModalContext;

  state = {
    facilities: {}
  };

  getResearchAreaOptions = memoize((i18n, researchAreas) => {
    //TODO deal with translations - text can be Trans object, but research areas are dynamically driven, so how to handle translations?

    return Object.keys(researchAreas).map(areaId => ({key: areaId, label: researchAreas[areaId], value: areaId}))//<option value={areaId} key={areaId}>{researchAreas[areaId]}</option>
  });


  render() {
    const {colony, gameConfig} = this.props;

    return <I18n>{({i18n}) => {
      if(!colony.colony.structuresWithCapability.research) {
        //this colony cannot do any research
        return '[TODO Colony incapable of research!]';
      }

      //Legends cannot be inline
      //Inline fields and their children must use the 'x wide' syntax???

      // return <Form name="example">
      //
      //   <Form.Group>
      //     <Form.Legend>Shipping information</Form.Legend>
      //
      //     <Form.Group>
      //       <Form.Legend label>Two equally spaced fields with a legend</Form.Legend>
      //
      //       <Form.Row two>
      //         <Form.Field name="firstName">
      //           <Form.Label hide>First name</Form.Label>
      //           <Form.Input placeholder="First name" />
      //         </Form.Field>
      //
      //         <Form.Field name="lastName">
      //           <Form.Label hide>Last name</Form.Label>
      //           <Form.Input placeholder="Last name" />
      //         </Form.Field>
      //       </Form.Row>
      //     </Form.Group>
      //
      //     <Form.Group>
      //       <Form.Legend label>Two unequally spaced fields with a legend</Form.Legend>
      //
      //       <Form.Row four>
      //         <Form.Field three wide name="streetAddress">
      //           <Form.Label hide>Street address</Form.Label>
      //           <Form.Input placeholder="Street address" />
      //         </Form.Field>
      //
      //         <Form.Field one wide name="lastName">
      //           <Form.Label hide>Last name</Form.Label>
      //           <Form.Input placeholder="Last name" />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row two>
      //         <Form.Field name="region">
      //           <Form.Label>1st labelled field</Form.Label>
      //           <Form.Input placeholder="State/region" />
      //         </Form.Field>
      //
      //         <Form.Field name="country">
      //           <Form.Label>2nd Labelled field</Form.Label>
      //           <Form.Select placeholder="Country" options={options} />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row one>
      //         <Form.Field name="other">
      //           <Form.Label>A textarea</Form.Label>
      //           <Form.Textarea placeholder="Other stuff" rows="5" />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       {/*Checkboxes*/}
      //       <Form.Row one>
      //         <Form.Field name="checkboxes">
      //           <Form.Label>Vertical checkboxes four columns</Form.Label>
      //           <Form.Checkboxes vertical columns={4} options={options} />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row one>
      //         <Form.Field name="checkboxes">
      //           <Form.Label>Horizontal checkboxes four columns</Form.Label>
      //           <Form.Checkboxes horizontal columns={4} options={options} />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row three>
      //         <Form.Field name="region">
      //           <Form.Label>1st labelled field</Form.Label>
      //           <Form.Input placeholder="State/region" />
      //         </Form.Field>
      //
      //         <Form.Field name="country">
      //           <Form.Label>2nd Labelled field</Form.Label>
      //           <Form.Select placeholder="Country" options={options} />
      //         </Form.Field>
      //
      //         <Form.Field name="checkboxes">
      //           <Form.Label>Some checkboxes</Form.Label>
      //           <Form.Checkboxes options={options} />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row twelve>
      //         <Form.Field eight wide name="checkboxes">
      //           <Form.Label>Horizontal two columns</Form.Label>
      //           <Form.Checkboxes horizontal columns={2} options={options} />
      //         </Form.Field>
      //
      //         <Form.Field two wide name="region">
      //           <Form.Label>1st labelled field</Form.Label>
      //           <Form.Input placeholder="State/region" />
      //         </Form.Field>
      //
      //         <Form.Field four two wide name="country">
      //           <Form.Label>2nd labelled field</Form.Label>
      //           <Form.Select placeholder="Country" options={options} />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       {/*Columns*/}
      //       <Form.Row twelve>
      //         <Form.Column four wide>
      //           <Form.Field name="region">
      //             <Form.Label>Input in column</Form.Label>
      //             <Form.Input placeholder="State/region" />
      //           </Form.Field>
      //
      //           <Form.Field name="region">
      //             <Form.Label>Checkbox in column</Form.Label>
      //             <Form.Input type="checkbox" placeholder="State/region" />
      //           </Form.Field>
      //
      //           <Form.Field name="region">
      //             <Form.Label>Select in column</Form.Label>
      //             <Form.Select placeholder="Country" options={options} />
      //           </Form.Field>
      //         </Form.Column>
      //
      //         <Form.Field eight wide name="other">
      //           <Form.Label>Next to column</Form.Label>
      //           <Form.Textarea placeholder="Other stuff" rows="6" />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row two>
      //         <Form.Column>
      //           <Form.Field name="region">
      //             <Form.Label>Input in column</Form.Label>
      //             <Form.Input placeholder="State/region" />
      //           </Form.Field>
      //
      //           <Form.Field name="region">
      //             <Form.Label>Checkbox in column</Form.Label>
      //             <Form.Input type="checkbox" placeholder="State/region" />
      //           </Form.Field>
      //
      //           <Form.Field name="region">
      //             <Form.Label>Select in column</Form.Label>
      //             <Form.Select placeholder="Country" options={options} />
      //           </Form.Field>
      //         </Form.Column>
      //
      //         <Form.Field name="other">
      //           <Form.Label>Next to column</Form.Label>
      //           <Form.Textarea placeholder="Other stuff" rows="6" />
      //         </Form.Field>
      //       </Form.Row>
      //     </Form.Group>
      //   </Form.Group>
      //
      //   <Form.Group>
      //     <Form.Legend>Billing information</Form.Legend>
      //
      //     <Form.Row one>
      //       <Form.Field name="cardType">
      //         <Form.Label>Card type</Form.Label>
      //         <Form.Select options={options} />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     <Form.Row sixteen>
      //       <Form.Field seven wide name="cardNumber">
      //         <Form.Label>Card number</Form.Label>
      //         <Form.Input placeholder="Card #" />
      //       </Form.Field>
      //       <Form.Field three wide name="cardCVC">
      //         <Form.Label>CVC</Form.Label>
      //         <Form.Input placeholder="CVC" maxLength="3" />
      //       </Form.Field>
      //
      //       <Form.Group six wide>
      //         <Form.Legend label>Expiration</Form.Legend>
      //
      //         <Form.Row two>
      //           <Form.Field name="cardExpiryMonth">
      //             <Form.Label hide>Card expiry month</Form.Label>
      //             <Form.Select options={options} />
      //           </Form.Field>
      //           <Form.Field name="cardExpiryYear">
      //             <Form.Label hide>Card expiry year</Form.Label>
      //             <Form.Input placeholder="Year" />
      //           </Form.Field>
      //         </Form.Row>
      //       </Form.Group>
      //     </Form.Row>
      //   </Form.Group>
      //
      //   <Form.Row>
      //     <Form.Field name="justARow">
      //       <Form.Label>Just a row</Form.Label>
      //       <Form.Input placeholder="Just a row" />
      //     </Form.Field>
      //   </Form.Row>
      //
      //   {/*Examples of checkboxes*/}
      //   <Form.Row one>
      //     <Form.Field name="cardExpiryYear">
      //       <Form.Label>Do not include a receipt in the package</Form.Label>
      //       <Form.Input placeholder="Year" type="checkbox" />
      //     </Form.Field>
      //   </Form.Row>
      //
      //   <Form.Row two>
      //     <Form.Field name="cardExpiryYear">
      //       <Form.Label>Do not include a receipt in the package</Form.Label>
      //       <Form.Input placeholder="Year" type="checkbox" />
      //     </Form.Field>
      //
      //     <Form.Field name="cardExpiryYear">
      //       <Form.Label>Do not include a receipt in the package</Form.Label>
      //       <Form.Input placeholder="Year" type="checkbox" />
      //     </Form.Field>
      //   </Form.Row>
      //
      //   {/*Specified width - width needs to be set on the label AND field - TODO maybe the field could handle this?*/}
      //   <Form.Row twelve>
      //     <Form.Field eight wide name="cardExpiryYear">
      //       <Form.Label>Another checkbox</Form.Label>
      //       <Form.Input placeholder="Year" type="checkbox" />
      //     </Form.Field>
      //
      //     <Form.Field four wide name="cardExpiryYear">
      //       <Form.Label>Yet another checkbox</Form.Label>
      //       <Form.Input placeholder="Year" type="checkbox" />
      //     </Form.Field>
      //   </Form.Row>
      //
      //   {/*Examples of inline rows*/}
      //   <Form.Group>
      //     <Form.Legend>Inline rows</Form.Legend>
      //     <Form.Row twelve>
      //       <Form.Field name="inlineRow" six wide inline>
      //         <Form.Label two wide>Inline row</Form.Label>
      //         <Form.Input four wide placeholder="Inline row" />
      //       </Form.Field>
      //
      //       <Form.Field name="inlineRow" six wide inline>
      //         <Form.Label two wide>Inline row</Form.Label>
      //         <Form.Input four wide placeholder="Inline row" />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     <Form.Row twelve>
      //       <Form.Field name="inlineRow" twelve wide inline>
      //         <Form.Label two wide>Inline row</Form.Label>
      //         <Form.Input ten wide placeholder="Inline row" />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     <Form.Row twelve>
      //       <Form.Field name="inlineRow" six wide inline>
      //         <Form.Label two wide>Inline row</Form.Label>
      //         <Form.Select four wide options={options} />
      //       </Form.Field>
      //
      //       {/*Inline checkbox - width needs to be set on the label - TODO maybe the field could handle this (same as above)?*/}
      //       <Form.Field name="inlineRow" six wide inline>
      //         <Form.Label six wide>Do not include a receipt in the package</Form.Label>
      //         <Form.Input placeholder="Year" type="checkbox" />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     {/*Inline row without explicit column width declarations - assumes all items the same width*/}
      //     <Form.Row three>
      //       <Form.Field name="inlineRow" inline>
      //         <Form.Label>Inline row</Form.Label>
      //         <Form.Input placeholder="Inline row" />
      //       </Form.Field>
      //
      //       <Form.Field name="inlineRow" inline>
      //         <Form.Label hide>Inline row</Form.Label>
      //         <Form.Input placeholder="Inline row" />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     {/*Inline textareas*/}
      //     <Form.Group>
      //       <Form.Legend>Inline textareas</Form.Legend>
      //
      //       <Form.Row twelve>
      //         <Form.Field twelve wide name="otherInline" inline>
      //           <Form.Label two wide>Other inline</Form.Label>
      //           <Form.Textarea ten wide placeholder="Other stuff" rows="5" />
      //         </Form.Field>
      //       </Form.Row>
      //
      //       <Form.Row twelve>
      //         <Form.Field six wide name="region" inline>
      //           <Form.Label two wide>State/Region</Form.Label>
      //           <Form.Input four wide placeholder="State/region" />
      //         </Form.Field>
      //
      //         <Form.Field six wide name="other" inline>
      //           <Form.Label two wide>Other</Form.Label>
      //           <Form.Textarea four wide placeholder="Other stuff" rows="5" />
      //         </Form.Field>
      //       </Form.Row>
      //     </Form.Group>
      //   </Form.Group>
      //
      //   {/*Inline checkboxes*/}
      //   <Form.Group>
      //     <Form.Legend>Inline checkboxes</Form.Legend>
      //
      //     <Form.Row twelve>
      //       <Form.Field twelve wide name="checkboxes" inline>
      //         <Form.Label two wide>5 vertical cols</Form.Label>
      //         <Form.Checkboxes ten wide vertical columns={5} options={options.slice(1)} />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     <Form.Row twelve>
      //       <Form.Field twelve wide name="checkboxes" inline>
      //         <Form.Label two wide>5 horz cols</Form.Label>
      //         <Form.Checkboxes ten wide horizontal columns={5} options={options.slice(1)} />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     <Form.Row twelve>
      //       <Form.Field six wide name="region" inline>
      //         <Form.Label two wide>State/Region</Form.Label>
      //         <Form.Input four wide placeholder="State/region" />
      //       </Form.Field>
      //
      //       <Form.Field six wide name="checkboxes" inline>
      //         <Form.Label two wide>2 horz cols</Form.Label>
      //         <Form.Checkboxes four wide horizontal columns={2} options={options.slice(1)} />
      //       </Form.Field>
      //     </Form.Row>
      //
      //     <Form.Row twelve>
      //       <Form.Field six wide name="region" inline>
      //         <Form.Label two wide>State/Region</Form.Label>
      //         <Form.Input four wide placeholder="State/region" />
      //       </Form.Field>
      //
      //       <Form.Field six wide name="checkboxes" inline>
      //         <Form.Label two wide>2 vert cols</Form.Label>
      //         <Form.Checkboxes four wide vertical columns={2} options={options.slice(1)} />
      //       </Form.Field>
      //     </Form.Row>
      //   </Form.Group>

      return <Form name="addEditResearchGroup">
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
                <Form.Input type="number" id={id} min={0} max={available} step={1} value={value} onChange={(e) => {this.updateSelectedFacilities(structureId, +e.target.value)}} />
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
