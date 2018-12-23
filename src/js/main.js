import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
//import omit from 'lodash/omit';

//import Tabs from './components/tabs/LocalStateTabs';
import Test from '@/components/test/Test';
import DataTable from '@/components/datatable/LocalStateDataTable';

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

function Bus() {
  return <div style={{padding: '10px'}}>
    <h3>Bus</h3>
    <DataTable
      defaultSortColumn="name"
      columns={[
        {name: 'name', label: 'Name'},
        {name: 'age', label: 'Age', valueType: 'number'},
        {name: 'joined', label: 'Joined', valueType: 'date'},
      ]}
      rows={[
        {id: '1', data: {name: 'Bob', age: 71, joined: new Date(2011, 9, 21)}},
        {id: '2', data: {name: 'Simon', age: 32, joined: new Date(2013, 12, 19)}},
        {id: '3', data: {name: 'Karen', age: 52, joined: new Date(2017, 11, 5)}},
        {id: '4', data: {name: 'Sarah', age: 29, joined: new Date(2014, 9, 3)}},
        {id: '5', data: {name: 'Chris', age: 44, joined: new Date(2017, 10, 19)}},
        {id: '6', data: {name: 'Ian', age: 43, joined: new Date(2010, 10, 30)}},
        {id: '7', data: {name: 'Jo', age: 42, joined: new Date(2013, 12, 28)}},
        {id: '8', data: {name: 'Pete', age: 41, joined: new Date(2015, 8, 1)}},
        {id: '9', data: {name: 'Kim', age: 40, joined: new Date(2017, 10, 10)}},
        {id: '10', data: {name: 'Anne', age: 39, joined: new Date(2013, 10, 23)}},
        {id: '11', data: {name: 'David', age: 38, joined: new Date(2014, 6, 26)}},
        {id: '12', data: {name: 'John', age: 37, joined: new Date(2015, 10, 16)}},
        {id: '13', data: {name: 'Phillip', age: 36, joined: new Date(2012, 7, 4)}},
        {id: '14', data: {name: 'Alan', age: 35, joined: new Date(2015, 3, 1)}},
        {id: '15', data: {name: 'Barbara', age: 34, joined: new Date(2010, 10, 18)}},
        {id: '16', data: {name: 'Catherine', age: 33, joined: new Date(2011, 10, 13)}},
        {id: '17', data: {name: 'Dion', age: 32, joined: new Date(2012, 7, 21)}},
        {id: '18', data: {name: 'Eric', age: 31, joined: new Date(2014, 9, 12)}},
        {id: '19', data: {name: 'Francis', age: 36, joined: new Date(2016, 8, 11)}},
        {id: '20', data: {name: 'Gareth', age: 29, joined: new Date(2017, 1, 24)}},
        {id: '21', data: {name: 'Harry', age: 28, joined: new Date(2016, 11, 23)}},
        {id: '22', data: {name: 'Ione', age: 27, joined: new Date(2018, 1, 30)}},
        {id: '23', data: {name: 'Jake', age: 66, joined: new Date(2018, 3, 9)}},
        {id: '24', data: {name: 'Kate', age: 25, joined: new Date(2012, 2, 10)}},
        {id: '25', data: {name: 'Laura', age: 24, joined: new Date(2013, 10, 20)}},
        {id: '26', data: {name: 'Mathew', age: 43, joined: new Date(2015, 5, 21)}},
        {id: '27', data: {name: 'Norman', age: 22, joined: new Date(2018, 10, 15)}},
        {id: '28', data: {name: 'Odin', age: 21, joined: new Date(2017, 10, 8)}},
        {id: '29', data: {name: 'Paul', age: 20, joined: new Date(2012, 6, 3)}},
        {id: '30', data: {name: 'Quinn', age: 19, joined: new Date(2011, 1, 14)}},
        {id: '31', data: {name: 'Richard', age: 57, joined: new Date(2010, 10, 21)}},
      ]}
    />
  </div>
}

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
