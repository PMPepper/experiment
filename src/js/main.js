import React from 'react';
import ReactDOM from 'react-dom';
import {compose, withStateHandlers} from 'recompose';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
//import omit from 'lodash/omit';

//import Tabs from './components/tabs/LocalStateTabs';
import Test from '@/components/test/Test';
import DataTable from '@/components/datatable/LocalStateDataTable';

import objectModify from '@/helpers/object-modify';

import * as dom from './dom';


import core from '../css/core.scss';

const title = 'Testing CSS modules';


////////////////////////////////////////////////////////////////////
// first our route components
const Sandwiches = React.lazy(() => import('./components/sandwiches/Sandwiches'));

function Tacos({ routes }) {
  return (
    <div>
      <h2>Tacos</h2>
      <ul>
        <li>
          <Link to="/tacos/bus">Bus</Link>
        </li>
        <li>
          <Link to="/tacos/cart">Cart</Link>
        </li>
      </ul>
      <Test />
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </div>
  );
}

const baseMemberTypes = {'1': 10, '2': 25};

const baseColumns = [
  {name: 'name', label: 'Name', sort: true, css: ['alignStart']},
  {name: 'age', label: 'Age', valueType: 'number', sort: true},
  {name: 'joined', label: 'Joined', valueType: 'date', sort: true},
  {name: 'memberType', label: 'Type', valueType: 'mapped', mappedValueType: 'number', mappedValues: baseMemberTypes, sort: false},
]

const defaultSortColumns = ['name', ['age', false]];

const Bus = compose(
  withStateHandlers({
    columns: baseColumns,
    memberTypes: baseMemberTypes,
    members: {
      '1': {name: 'Bob', age: 71, joined: new Date(2011, 9, 21), memberType: '1'},// Smithington the 3rd of westminster
      '2': {name: 'Simon', age: 32, joined: new Date(2013, 12, 19), memberType: '1'},
      '3': {name: 'Karen', age: 52, joined: new Date(2017, 11, 5), memberType: '1'},
      '4': {name: 'Sarah', age: 29, joined: new Date(2014, 9, 3), memberType: '1'},
      '5': {name: 'Chris', age: 44, joined: new Date(2017, 10, 19), memberType: '1'},
      '6': {name: 'Ian', age: 43, joined: new Date(2010, 10, 30), memberType: '2'},
      '7': {name: 'Jo', age: 42, joined: new Date(2013, 12, 28), memberType: '1'},
      '8': {name: 'Pete', age: 41, joined: new Date(2015, 8, 1), memberType: '1'},
      '9': {name: 'Kim', age: 40, joined: new Date(2017, 10, 10), memberType: '2'},
      '10': {name: 'Anne', age: 39, joined: new Date(2013, 10, 23), memberType: '1'},
      '11': {name: 'David', age: 38, joined: new Date(2014, 6, 26), memberType: '1'},
      '12': {name: 'John', age: 37, joined: new Date(2015, 10, 16), memberType: '2'},
      '13': {name: 'Phillip', age: 36, joined: new Date(2012, 7, 4), memberType: '1'},
      '14': {name: 'Alan', age: 35, joined: new Date(2015, 3, 1), memberType: '1'},
      '15': {name: 'Barbara', age: 34, joined: new Date(2010, 10, 18), memberType: '1'},
      '16': {name: 'Catherine', age: 33, joined: new Date(2011, 10, 13), memberType: '1'},
      '17': {name: 'Dion', age: 32, joined: new Date(2012, 7, 21), memberType: '2'},
      '18': {name: 'Eric', age: 31, joined: new Date(2014, 9, 12), memberType: '1'},
      '19': {name: 'Francis', age: 36, joined: new Date(2016, 8, 11), memberType: '2'},
      '20': {name: 'Gareth', age: 29, joined: new Date(2017, 1, 24), memberType: '1'},
      '21': {name: 'Harry', age: 28, joined: new Date(2016, 11, 23), memberType: '1'},
      '22': {name: 'Ione', age: 27, joined: new Date(2018, 1, 30), memberType: '1'},
      '23': {name: 'Jake Smithington the 3rd of westminster', age: 42, joined: new Date(2018, 3, 9), memberType: '2'},
      '24': {name: 'Kate', age: 25, joined: new Date(2012, 2, 10), memberType: '1'},
      '25': {name: 'Laura', age: 24, joined: new Date(2013, 10, 20), memberType: '2'},
      '26': {name: 'Mathew', age: 43, joined: new Date(2015, 5, 21), memberType: '1'},
      '27': {name: 'Norman', age: 22, joined: new Date(2018, 10, 15), memberType: '1'},
      '28': {name: 'Odin', age: 21, joined: new Date(2017, 10, 8), memberType: '1'},
      '29': {name: 'Paul', age: 20, joined: new Date(2012, 6, 3), memberType: '2'},
      '30': {name: 'Quinn', age: 19, joined: new Date(2011, 1, 14), memberType: '1'},
      '31': {name: 'Richard', age: 57, joined: new Date(2010, 10, 21), memberType: '1'},
    }
  }, {
    setMemberTypes: ({columns}) => (memberTypes) => {
      return {
        memberTypes,
        columns: objectModify(columns, [3, 'mappedValues'], memberTypes)
      }
    },
    setMembers: () => (members) => ({members}),
  })
)(function BusPresentational({columns, members, setMembers, memberTypes, setMemberTypes}) {
  return <div style={{padding: '10px'}}>
    <h3>Bus</h3>
    <button onClick={() => {setMemberTypes({
      '1': Math.round(Math.random() * 20),
      '2': Math.round(Math.random() * 20)
    })}}>
      New types
    </button>

    <button onClick={() => {
      const newMembers = {
        ...members,
        [Date.now() + Math.random()]: {
          name: 'New member',
          age: Math.round((Math.random() * 60) + 10),
          joined: new Date(
            2010 + Math.round(Math.random() * 8),
            Math.ceil(Math.random() * 12),
            Math.ceil(Math.random() * 28)
          ),
          memberType: Math.random() > 0.5 ? '1' : '2'
        }
      };

      setMembers(newMembers);
    }}>
      New member
    </button>
    <DataTable
      columns={columns}
      rows={members}

      defaultSortColumns={defaultSortColumns}

      clickTogglesExpandedRows={true}
      getExpandedRowContents={(row) => {
        // style={{borderBottom:'1px solid #7f7f7f'}}
        return <div>
          <p>Hello {row.data.name}</p>
          <p>Lorem ipsum</p>
          <p>Lorem ipsum dolor sit amet</p>
          <p>Lorem ipsum</p>
          <p>Lorem ipsum</p>
          <p>Lorem ipsum</p>
        </div>
      }}

      /*expandableRowContentComponent={(props) => {
        return <b>{props.children}</b>
      }}*/
    />
  </div>
});

function Cart() {
  return <h3>Cart</h3>;
}


////////////////////////////////////////////////////////////
// then our route config
const routes = [
  {
    path: "/sandwiches/:id?",
    component: Sandwiches
  },
  {
    path: "/tacos",
    component: Tacos,
    routes: [
      {
        path: "/tacos/bus",
        component: Bus
      },
      {
        path: "/tacos/cart",
        component: Cart
      }
    ]
  },
  {
    component: () => (<p>NOT FOUND!</p>)
  }
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
function RouteWithSubRoutes(route) {
  return <Route
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
}

function RouteConfigExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/tacos">Tacos</Link>
          </li>
          <li>
            <Link to="/sandwiches">Sandwiches</Link>
          </li>
        </ul>

        <React.Suspense fallback={<div>Loading...</div>}>
          <Switch>{
            routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
}


////////////////////////////////////////////////////////////////////////////////
ReactDOM.render(
  <div>
    <h1>{title}</h1>
    <h2>Tabs test</h2>
    {/*<Tabs>
      <p key="tab1" tab-title="Hello world">This is a tab content for the first tab.</p>
      <p key="tab2" tab-title="Foo bar">This is a tab content for the second tab. Some more text. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. </p>
      <p key="tab3" tab-title="Tab three">This is a tab content for the <b>third</b> tab!</p>
      <p key="tab4" tab-title="Tab four">This is a tab content for the <b>fourth</b> tab!</p>
      <p key="tab5" tab-title="Tab five">This is a tab content for the <b>fifth</b> tab!</p>
      <p key="tab6" tab-title="Tab size">This is a tab content for the <b>sixth</b> tab!</p>
    </Tabs>*/}
    <RouteConfigExample />
  </div>,
  document.getElementById('app')
);


if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
