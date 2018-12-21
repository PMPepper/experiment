import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

import Tabs from './components/tabs/LocalStateTabs';

import core from '../css/core.scss';

const title = 'Testing CSS modules';


////////////////////////////////////////////////////////////////////
// first our route components
function Sandwiches() {
  return <h2>Sandwiches</h2>;
}

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

      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </div>
  );
}

function Bus() {
  return <h3>Bus</h3>;
}

function Cart() {
  return <h3>Cart</h3>;
}


////////////////////////////////////////////////////////////
// then our route config
const routes = [
  {
    path: "/sandwiches",
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

        <Switch>{
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </div>
    </Router>
  );
}


////////////////////////////////////////////////////////////////////////////////
ReactDOM.render(
  <div>
    <h1>{title}</h1>
    <h2>Tabs test</h2>
    <Tabs>
      <p key="tab1" tab-title="Hello world">This is a tab content for the first tab.</p>
      <p key="tab2" tab-title="Foo bar">This is a tab content for the second tab. Some more text. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. </p>
      <p key="tab3" tab-title="Tab three">This is a tab content for the <b>third</b> tab!</p>
      <p key="tab4" tab-title="Tab four">This is a tab content for the <b>fourth</b> tab!</p>
      <p key="tab5" tab-title="Tab five">This is a tab content for the <b>fifth</b> tab!</p>
      <p key="tab6" tab-title="Tab size">This is a tab content for the <b>sixth</b> tab!</p>
    </Tabs>
    <RouteConfigExample />
  </div>,
  document.getElementById('app')
);


if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
