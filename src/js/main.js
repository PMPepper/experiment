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
        {name: 'name', label: 'Name', sort: (a, b) => {console.log(a, b); return 0;}}, 
        {name: 'age', label: 'Age', valueType: 'number', sort: (a, b) => {console.log(a, b); return 0;}}
      ]}
      rows={[
        {id: '1', data: {name: 'Bob', age: 71}},
        {id: '2', data: {name: 'Simon', age: 32}},
        {id: '3', data: {name: 'Karen', age: 52}},
        {id: '4', data: {name: 'Sarah', age: 29}},
        {id: '5', data: {name: 'Chris', age: 44}},
        {id: '6', data: {name: 'Ian', age: 43}},
        {id: '7', data: {name: 'Jo', age: 42}},
        {id: '8', data: {name: 'Pete', age: 41}},
        {id: '9', data: {name: 'Kim', age: 40}},
        {id: '10', data: {name: 'Anne', age: 39}},
        {id: '11', data: {name: 'David', age: 38}},
        {id: '12', data: {name: 'John', age: 37}},
        {id: '13', data: {name: 'Phillip', age: 36}},
        {id: '14', data: {name: 'Alan', age: 35}},
        {id: '15', data: {name: 'Barbara', age: 34}},
        {id: '16', data: {name: 'Catherine', age: 33}},
        {id: '17', data: {name: 'Dion', age: 32}},
        {id: '18', data: {name: 'Eric', age: 31}},
        {id: '19', data: {name: 'Francis', age: 36}},
        {id: '20', data: {name: 'Gareth', age: 29}},
        {id: '21', data: {name: 'Harry', age: 28}},
        {id: '22', data: {name: 'Ione', age: 27}},
        {id: '23', data: {name: 'Jake', age: 66}},
        {id: '24', data: {name: 'Kate', age: 25}},
        {id: '25', data: {name: 'Laura', age: 24}},
        {id: '26', data: {name: 'Mathew', age: 43}},
        {id: '27', data: {name: 'Norman', age: 22}},
        {id: '28', data: {name: 'Odin', age: 21}},
        {id: '29', data: {name: 'Paul', age: 20}},
        {id: '30', data: {name: 'Quinn', age: 19}},
        {id: '31', data: {name: 'Richard', age: 57}},
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
