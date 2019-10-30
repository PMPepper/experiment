import React from 'react';
import Form from '@/components/form/Form';


const options = [
  {label: 'A long text label to test wrapping of text in this context', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Animal', value: 'animal'},
  {label: 'Tree', value: 'tree'},
  {label: 'Mineral', value: 'mineral'},
  {label: 'Vegetable', value: 'vegetable'},
  {label: 'Other', value: 'other'},
]










export default function Test() {
  return <div style={{padding: '10px'}}>
    <Form name="example">
      <Form.Group>
        <Form.Legend>Shipping information</Form.Legend>

        <Form.Group>
          <Form.Legend label>Two equally spaced fields with a legend</Form.Legend>

          <Form.Row columns={2}>
            <Form.Field name="firstName">
              <Form.Label hide>First name</Form.Label>
              <Form.Input placeholder="First name" />
            </Form.Field>

            <Form.Field name="lastName">
              <Form.Label hide>Last name</Form.Label>
              <Form.Input placeholder="Last name" />
            </Form.Field>
          </Form.Row>
        </Form.Group>

        <Form.Group>
          <Form.Legend label>Two unequally spaced fields with a legend</Form.Legend>

          <Form.Row columns={4}>
            <Form.Field width={3} name="streetAddress">
              <Form.Label hide>Street address</Form.Label>
              <Form.Input placeholder="Street address" />
            </Form.Field>

            <Form.Field width={1} name="lastName">
              <Form.Label hide>Last name</Form.Label>
              <Form.Input placeholder="Last name" />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={2}>
            <Form.Field name="region">
              <Form.Label>1st labelled field</Form.Label>
              <Form.Input placeholder="State/region" />
            </Form.Field>

            <Form.Field name="country">
              <Form.Label>2nd Labelled field</Form.Label>
              <Form.Select placeholder="Country" options={options} />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={1}>
            <Form.Field name="other">
              <Form.Label>A textarea</Form.Label>
              <Form.Textarea placeholder="Other stuff" rows="5" />
            </Form.Field>
          </Form.Row>

          {/*Checkboxes*/}
          <Form.Row columns={1}>
            <Form.Field name="checkboxes">
              <Form.Label>Vertical checkboxes four columns</Form.Label>
              <Form.Checkboxes vertical columns={4} options={options} />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={1}>
            <Form.Field name="checkboxes">
              <Form.Label>Horizontal checkboxes four columns</Form.Label>
              <Form.Checkboxes horizontal columns={4} options={options} />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={3}>
            <Form.Field name="region">
              <Form.Label>1st labelled field</Form.Label>
              <Form.Input placeholder="State/region" />
            </Form.Field>

            <Form.Field name="country">
              <Form.Label>2nd Labelled field</Form.Label>
              <Form.Select placeholder="Country" options={options} />
            </Form.Field>

            <Form.Field name="checkboxes">
              <Form.Label>Some checkboxes</Form.Label>
              <Form.Checkboxes options={options} />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={12}>
            <Form.Field width={8} name="checkboxes">
              <Form.Label>Horizontal two columns</Form.Label>
              <Form.Checkboxes horizontal columns={2} options={options} />
            </Form.Field>

            <Form.Field width={2} name="region">
              <Form.Label>1st labelled field</Form.Label>
              <Form.Input placeholder="State/region" />
            </Form.Field>

            <Form.Field width={2} name="country">
              <Form.Label>2nd labelled field</Form.Label>
              <Form.Select placeholder="Country" options={options} />
            </Form.Field>
          </Form.Row>

          {/*Columns*/}
          <Form.Row columns={12}>
            <Form.Column width={4}>
              <Form.Field name="region">
                <Form.Label>Input in column</Form.Label>
                <Form.Input placeholder="State/region" />
              </Form.Field>

              <Form.Field name="region">
                <Form.Label>Checkbox in column</Form.Label>
                <Form.Input type="checkbox" placeholder="State/region" />
              </Form.Field>

              <Form.Field name="region">
                <Form.Label>Select in column</Form.Label>
                <Form.Select placeholder="Country" options={options} />
              </Form.Field>
            </Form.Column>

            <Form.Field width={8} name="other">
              <Form.Label>Next to column</Form.Label>
              <Form.Textarea placeholder="Other stuff" rows="6" />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={2}>
            <Form.Column>
              <Form.Field name="region">
                <Form.Label>Input in column</Form.Label>
                <Form.Input placeholder="State/region" />
              </Form.Field>

              <Form.Field name="region">
                <Form.Label>Checkbox in column</Form.Label>
                <Form.Input type="checkbox" placeholder="State/region" />
              </Form.Field>

              <Form.Field name="region">
                <Form.Label>Select in column</Form.Label>
                <Form.Select placeholder="Country" options={options} />
              </Form.Field>
            </Form.Column>

            <Form.Field name="other">
              <Form.Label>Next to column</Form.Label>
              <Form.Textarea placeholder="Other stuff" rows="6" />
            </Form.Field>
          </Form.Row>
        </Form.Group>
      </Form.Group>

      <Form.Group>
        <Form.Legend>Billing information</Form.Legend>

        <Form.Row>
          <Form.Field name="cardType">
            <Form.Label>Card type</Form.Label>
            <Form.Select options={options} />
          </Form.Field>
        </Form.Row>

        <Form.Row columns={16}>
          <Form.Field width={7} name="cardNumber">
            <Form.Label>Card number</Form.Label>
            <Form.Input placeholder="Card #" />
          </Form.Field>
          <Form.Field width={3} name="cardCVC">
            <Form.Label>CVC</Form.Label>
            <Form.Input placeholder="CVC" maxLength="3" />
          </Form.Field>

          <Form.Group width={6}>
            <Form.Legend label>Expiration</Form.Legend>

            <Form.Row columns={2}>
              <Form.Field name="cardExpiryMonth">
                <Form.Label hide>Card expiry month</Form.Label>
                <Form.Select options={options} />
              </Form.Field>
              <Form.Field name="cardExpiryYear">
                <Form.Label hide>Card expiry year</Form.Label>
                <Form.Input placeholder="Year" />
              </Form.Field>
            </Form.Row>
          </Form.Group>
        </Form.Row>
      </Form.Group>

      <Form.Row>
        <Form.Field name="justARow">
          <Form.Label>Just a row</Form.Label>
          <Form.Input placeholder="Just a row" />
        </Form.Field>
      </Form.Row>

      {/*Examples of checkboxes*/}
      <Form.Row columns={1}>
        <Form.Field name="cardExpiryYear">
          <Form.Label>Do not include a receipt in the package</Form.Label>
          <Form.Input placeholder="Year" type="checkbox" />
        </Form.Field>
      </Form.Row>

      <Form.Row columns={2}>
        <Form.Field name="cardExpiryYear">
          <Form.Label>Do not include a receipt in the package</Form.Label>
          <Form.Input placeholder="Year" type="checkbox" />
        </Form.Field>

        <Form.Field name="cardExpiryYear">
          <Form.Label>Do not include a receipt in the package</Form.Label>
          <Form.Input placeholder="Year" type="checkbox" />
        </Form.Field>
      </Form.Row>

      {/*Specified width - width needs to be set on the label AND field - TODO maybe the field could handle this?*/}
      <Form.Row columns={12}>
        <Form.Field width={8} name="cardExpiryYear">
          <Form.Label>Another checkbox</Form.Label>
          <Form.Input placeholder="Year" type="checkbox" />
        </Form.Field>

        <Form.Field width={4} name="cardExpiryYear">
          <Form.Label>Yet another checkbox</Form.Label>
          <Form.Input placeholder="Year" type="checkbox" />
        </Form.Field>
      </Form.Row>

      {/*Examples of inline rows*/}
      <Form.Group>
        <Form.Legend>Inline rows</Form.Legend>
        <Form.Row columns={12}>
          <Form.Field width={6} columns={6} name="inlineRow" inline>
            <Form.Label width={2}>Inline row</Form.Label>
            <Form.Input width={4} placeholder="Inline row" />
          </Form.Field>

          <Form.Field width={6} columns={6} name="inlineRow" inline>
            <Form.Label width={2}>Inline row</Form.Label>
            <Form.Input width={4} placeholder="Inline row" />
          </Form.Field>
        </Form.Row>

        <Form.Row columns={12}>
          <Form.Field width={12} columns={12} name="inlineRow" inline>
            <Form.Label width={2}>Inline row</Form.Label>
            <Form.Input width={10} placeholder="Inline row" />
          </Form.Field>
        </Form.Row>

        <Form.Row columns={12}>
          <Form.Field width={6} columns={6} name="inlineRow" inline>
            <Form.Label width={2}>Inline row</Form.Label>
            <Form.Select width={4} options={options} />
          </Form.Field>

          {/*Inline checkbox - width needs to be set on the label - TODO maybe the field could handle this (same as above)?*/}
          <Form.Field width={6} columns={6} name="inlineRow" inline>
            <Form.Label width={6}>Do not include a receipt in the package</Form.Label>
            <Form.Input placeholder="Year" type="checkbox" />
          </Form.Field>
        </Form.Row>

        {/*Inline row without explicit column width declarations - assumes all items the same width*/}
        {/*<Form.Row columns={3}>
          <Form.Field name="inlineRow" inline>
            <Form.Label>Inline row</Form.Label>
            <Form.Input placeholder="Inline row" />
          </Form.Field>

          <Form.Field name="inlineRow" inline>
            <Form.Label hide>Inline row</Form.Label>
            <Form.Input placeholder="Inline row" />
          </Form.Field>
        </Form.Row>*/}

        {/*Inline textareas*/}
        <Form.Group>
          <Form.Legend>Inline textareas</Form.Legend>

          <Form.Row columns={12}>
            <Form.Field width={12} columns={12} name="otherInline" inline>
              <Form.Label width={2}>Other inline</Form.Label>
              <Form.Textarea width={10} placeholder="Other stuff" rows="5" />
            </Form.Field>
          </Form.Row>

          <Form.Row columns={12}>
            <Form.Field width={6} columns={6} name="region" inline>
              <Form.Label width={2}>State/Region</Form.Label>
              <Form.Input width={4} placeholder="State/region" />
            </Form.Field>

            <Form.Field width={6} columns={6} name="other" inline>
              <Form.Label width={2}>Other</Form.Label>
              <Form.Textarea width={4} placeholder="Other stuff" rows="5" />
            </Form.Field>
          </Form.Row>
        </Form.Group>
      </Form.Group>

      {/*Inline checkboxes*/}
      <Form.Group>
        <Form.Legend>Inline checkboxes</Form.Legend>

        <Form.Row columns={12}>
          <Form.Field width={12} columns={12} name="checkboxes" inline>
            <Form.Label width={12}>5 vertical cols</Form.Label>
            <Form.Checkboxes width={10} vertical columns={5} options={options.slice(1)} />
          </Form.Field>
        </Form.Row>

        <Form.Row columns={12}>
          <Form.Field  width={12} columns={12}name="checkboxes" inline>
            <Form.Label width={2}>5 horz cols</Form.Label>
            <Form.Checkboxes width={10} horizontal columns={5} options={options.slice(1)} />
          </Form.Field>
        </Form.Row>

        <Form.Row columns={12}>
          <Form.Field width={6} columns={6} name="region" inline>
            <Form.Label width={2}>State/Region</Form.Label>
            <Form.Input width={4} placeholder="State/region" />
          </Form.Field>

          <Form.Field columns={6} width={6} name="checkboxes" inline>
            <Form.Label width={2}>2 horz cols</Form.Label>
            <Form.Checkboxes width={4} horizontal columns={2} options={options.slice(1)} />
          </Form.Field>
        </Form.Row>

        <Form.Row columns={12}>
          <Form.Field width={6} columns={6} name="region" inline>
            <Form.Label width={2}>State/Region</Form.Label>
            <Form.Input width={4} placeholder="State/region" />
          </Form.Field>

          <Form.Field width={6} columns={6} name="checkboxes" inline>
            <Form.Label width={2}>2 vert cols</Form.Label>
            <Form.Checkboxes width={4} vertical columns={2} options={options.slice(1)} />
          </Form.Field>
        </Form.Row>
      </Form.Group>
    </Form>
  </div>
}




// import {compose, withStateHandlers} from 'recompose';
//
// import DataTable from '@/components/datatable/LocalStateDataTable';
// import Tabs from '@/components/tabs/LocalStateTabs';
// import Tab from '@/components/tabs/Tab';
//
// import AddContextMenu from '@/components/contextMenu/AddContextMenu';
//
// //import Icon from '@/components/icon/Icon';
//
// import modify from '@/helpers/object/modify';
//
//
// //Datatable example
// const baseMemberTypes = {'1': 10, '2': 25};
//
// const baseColumns = [
//   {name: 'name', label: 'Name', sort: true, css: ['alignStart']},
//   {name: 'age', label: 'Age', valueType: 'number', sort: true},
//   {name: 'joined', label: 'Joined', valueType: 'date', sort: true},
//   {name: 'memberType', label: 'Type', valueType: 'mapped', mappedValueType: 'number', mappedValues: baseMemberTypes, sort: false},
// ]
//
// const defaultSortColumns = ['name', ['age', false]];
//
// export default compose(
//   withStateHandlers({
//     columns: baseColumns,
//     memberTypes: baseMemberTypes,
//     members: {
//       '1': {name: 'Bob', age: 71, joined: new Date(2011, 9, 21), memberType: '1'},// Smithington the 3rd of westminster
//       '2': {name: 'Simon', age: 32, joined: new Date(2013, 12, 19), memberType: '1'},
//       '3': {name: 'Karen', age: 52, joined: new Date(2017, 11, 5), memberType: '1'},
//       '4': {name: 'Sarah', age: 29, joined: new Date(2014, 9, 3), memberType: '1'},
//       '5': {name: 'Chris', age: 44, joined: new Date(2017, 10, 19), memberType: '1'},
//       '6': {name: 'Ian', age: 43, joined: new Date(2010, 10, 30), memberType: '2'},
//       '7': {name: 'Jo', age: 42, joined: new Date(2013, 12, 28), memberType: '1'},
//       '8': {name: 'Pete', age: 41, joined: new Date(2015, 8, 1), memberType: '1'},
//       '9': {name: 'Kim', age: 40, joined: new Date(2017, 10, 10), memberType: '2'},
//       '10': {name: 'Anne', age: 39, joined: new Date(2013, 10, 23), memberType: '1'},
//       '11': {name: 'David', age: 38, joined: new Date(2014, 6, 26), memberType: '1'},
//       '12': {name: 'John', age: 37, joined: new Date(2015, 10, 16), memberType: '2'},
//       '13': {name: 'Phillip', age: 36, joined: new Date(2012, 7, 4), memberType: '1'},
//       '14': {name: 'Alan', age: 35, joined: new Date(2015, 3, 1), memberType: '1'},
//       '15': {name: 'Barbara', age: 34, joined: new Date(2010, 10, 18), memberType: '1'},
//       '16': {name: 'Catherine', age: 33, joined: new Date(2011, 10, 13), memberType: '1'},
//       '17': {name: 'Dion', age: 32, joined: new Date(2012, 7, 21), memberType: '2'},
//       '18': {name: 'Eric', age: 31, joined: new Date(2014, 9, 12), memberType: '1'},
//       '19': {name: 'Francis', age: 36, joined: new Date(2016, 8, 11), memberType: '2'},
//       '20': {name: 'Gareth', age: 29, joined: new Date(2017, 1, 24), memberType: '1'},
//       '21': {name: 'Harry', age: 28, joined: new Date(2016, 11, 23), memberType: '1'},
//       '22': {name: 'Ione', age: 27, joined: new Date(2018, 1, 30), memberType: '1'},
//       '23': {name: 'Jake Smithington the 3rd of westminster', age: 42, joined: new Date(2018, 3, 9), memberType: '2'},
//       '24': {name: 'Kate', age: 25, joined: new Date(2012, 2, 10), memberType: '1'},
//       '25': {name: 'Laura', age: 24, joined: new Date(2013, 10, 20), memberType: '2'},
//       '26': {name: 'Mathew', age: 43, joined: new Date(2015, 5, 21), memberType: '1'},
//       '27': {name: 'Norman', age: 22, joined: new Date(2018, 10, 15), memberType: '1'},
//       '28': {name: 'Odin', age: 21, joined: new Date(2017, 10, 8), memberType: '1'},
//       '29': {name: 'Paul', age: 20, joined: new Date(2012, 6, 3), memberType: '2'},
//       '30': {name: 'Quinn', age: 19, joined: new Date(2011, 1, 14), memberType: '1'},
//       '31': {name: 'Richard', age: 57, joined: new Date(2010, 10, 21), memberType: '1'},
//     }
//   }, {
//     setMemberTypes: ({columns}) => (memberTypes) => {
//       return {
//         memberTypes,
//         columns: modify(columns, [3, 'mappedValues'], memberTypes)
//       }
//     },
//     setMembers: () => (members) => ({members}),
//   })
// )(function App({columns, members, setMembers, memberTypes, setMemberTypes}) {
//   return <div>
//     <h3>Example datatable</h3>
//     <button onClick={() => {setMemberTypes({
//       '1': Math.round(Math.random() * 20),
//       '2': Math.round(Math.random() * 20)
//     })}}>
//       New types
//     </button>
//
//     <AddContextMenu getItems={() => {return [
//       {label: 'Hello!', action: () => {console.log('Hello?!?!?!?')}},
//       {label: 'Goodbye', items: [
//         {label: 'Foo', action: () => {console.log('Foo?!?!?!?')}},
//         {label: 'Bar', action: () => {console.log('Bar?!?!?!?')}},
//         'spacer',
//         {label: 'w00t', items: [
//           {label: 'Foo1', action: () => {console.log('Foo1?!?!?!?')}},
//           {label: 'Bar1', action: () => {console.log('Bar1?!?!?!?')}},
//         ]}
//       ]}
//     ]}}>
//       <button onClick={() => {
//         const newMembers = {
//           ...members,
//           [Date.now() + Math.random()]: {
//             name: 'New member',
//             age: Math.round((Math.random() * 60) + 10),
//             joined: new Date(
//               2010 + Math.round(Math.random() * 8),
//               Math.ceil(Math.random() * 12),
//               Math.ceil(Math.random() * 28)
//             ),
//             memberType: Math.random() > 0.5 ? '1' : '2'
//           }
//         };
//
//         setMembers(newMembers);
//       }}>
//         New member
//       </button>
//     </AddContextMenu>
//
//     <DataTable
//       columns={columns}
//       rows={members}
//       defaultSortColumns={defaultSortColumns}
//
//       //rowProps={{onClick: (e) => {alert(e.type+'>!>!')}}}
//
//       //Selection props
//       clickTogglesSelectedRows={true}
//
//       //Expand row rows
//       //expandedRows={{1: true}}
//       //clickTogglesExpandedRows={true}
//       addExpandRowColumn={true}
//       getExpandedRowContents={(row) => {
//         return <div style={{padding: '8px'}}>
//           <Tabs>
//             <Tab className="wysiwyg" key="tab1" tab-title="Hello world"><p>This is a tab content for the first tab.</p></Tab>
//             <Tab className="wysiwyg" key="tab2" tab-title="Foo bar"><p>This is a tab content for the second tab. Some more text. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. </p></Tab>
//             <Tab className="wysiwyg" key="tab3" tab-title="Tab three">
//               <p>Hello {row.data.name}</p>
//               <p>Lorem ipsum</p>
//               <p>Lorem ipsum dolor sit amet</p>
//               <p>Lorem ipsum</p>
//               <p>Lorem ipsum</p>
//               <p>Lorem ipsum</p>
//               <button>A button</button>
//             </Tab>
//             <Tab className="wysiwyg" key="tab4" tab-title="Tab four">
//               <p>This is a tab content for the <b>fourth</b> tab!</p>
//               <button>A button</button>
//             </Tab>
//             <Tab className="wysiwyg" key="tab5" tab-title="Tab five"><p>This is a tab content for the <b>fifth</b> tab!</p></Tab>
//             <Tab className="wysiwyg" key="tab6" tab-title="Tab size"><p>This is a tab content for the <b>sixth</b> tab!</p></Tab>
//           </Tabs>
//         </div>
//       }}
//     />
//   </div>
// });
//
//
// {/*<Tabs>
//   <p key="tab1" tab-title="Hello world">This is a tab content for the first tab.</p>
//   <p key="tab2" tab-title="Foo bar">This is a tab content for the second tab. Some more text. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. </p>
//   <p key="tab3" tab-title="Tab three">This is a tab content for the <b>third</b> tab!</p>
//   <p key="tab4" tab-title="Tab four">This is a tab content for the <b>fourth</b> tab!</p>
//   <p key="tab5" tab-title="Tab five">This is a tab content for the <b>fifth</b> tab!</p>
//   <p key="tab6" tab-title="Tab size">This is a tab content for the <b>sixth</b> tab!</p>
// </Tabs>*/}
