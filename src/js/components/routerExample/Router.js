import React from 'react';
import {HashRouter as Router, Route, Link, Switch} from "react-router-dom";

import Bus from './Bus';
import Cart from './Cart';
//import Sandwiches from './Sandwiches';
import Tacos from './Tacos';
import RouteWithSubRoutes from './RouteWithSubRoutes';


const Sandwiches = React.lazy(() => import('./Sandwiches'));


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


export default function RouteConfigExample() {
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
