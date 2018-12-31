import React from 'react';
import ReactDOM from 'react-dom';

import * as dom from './dom';
import core from '../css/core.scss';

import polyfills from './polyfills';

import Game from '@/components/game/Game';

//vars
const title = 'React/Webpack testing';

//TODO list:
//-finish datatables
//-add context menus
//-add tooltips
//-add forms support


//Test code
//import Test from '@/components/test/Test';


polyfills.then(() => {
    ReactDOM.render(
      <Game />,
      document.getElementById('app')
    );
  })
  /*.catch(error => {
    //TODO better error handling
    console.error('Failed fetching polyfills ', error);
  });*/

if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
