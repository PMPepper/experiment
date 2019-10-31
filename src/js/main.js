import React from 'react';
import ReactDOM from 'react-dom';
import {I18nProvider, I18n} from '@lingui/react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
//import 'semantic-ui-css/semantic.min.css';

import * as dom from './dom';
import polyfills from './polyfills';
import core from '../css/core.scss';

//App specific
import root from '@/redux/root';
import Game from '@/components/game/Game';

import {I18nContext} from '@/hooks/useI18n';


//Game engine
import * as GameEngine from '@/game/Game';
import Client from '@/game/Client';
import LocalConnector from '@/game/LocalConnector';

import baseGameDefinition from '@/game/data/baseGameDefinition';//TEMP CODE

//vars
const title = 'React/Webpack testing';

//import Test from '@/components/test/Test';


var store;

if(process.env.NODE_ENV !== 'production') {
  store = createStore(root, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

  window.store = store;
} else {
  store = createStore(root)
}

//REAL TEMP CODE!


//TODO list:
//-finish datatables
//-add tooltips
//-add forms support


polyfills.then(() => {
  //TEMP CODE
  const gameServer = GameEngine.startGame(baseGameDefinition, new Client('local', store, new LocalConnector())).then((client) => {
      console.log('[MAIN] render');


      // ReactDOM.render(
      //   <Test />,
      //   document.getElementById('app')
      // )

      ReactDOM.render(
        <Provider store={store}>
          <I18nProvider language="en-GB">
            <I18n>{({i18n}) => (
              <I18nContext.Provider value={i18n}>
                <Game client={client} />
                <OutputMeasuredPerformance />
              </I18nContext.Provider>
            )}</I18n>
          </I18nProvider>
        </Provider>,
        document.getElementById('app')
      );
    });
  })
  /*.catch(error => {
    //TODO better error handling for failed polyfills loading
    console.error('Failed fetching polyfills ', error);
  });*/

if(process.env.NODE_ENV !== 'production') {
  //module.hot.accept();
}



//////////////////
// Benchmarking //
//////////////////
import useInterval from '@/hooks/useInterval';
import useForceRender from '@/hooks/useForceRender';

let lastName = '';
const values = [] = window._measuredPerformance = [];
const numValues = 600;

function OutputMeasuredPerformance(props) {
  const forceRender = useForceRender();
  useInterval(forceRender, 1);

  let mp = null;

  if(values.length > 0) {
    mp = values[values.length - 1];

    if(mp.name !== lastName) {
      lastName = mp.name;
      values.length = 0;
      values.push(mp);
    }

    while(values.length > numValues) {
      values.shift();
    }
  }

  const avg = values.length > 0 ?
    values.reduce((total, value) => {return total + value.duration}, 0) / values.length
    :
    '-';

  return <div style={{position: 'absolute', left: '10px', bottom: '50px', background: '#FFF', padding: '10px', color: '#000', width: '200px'}}>
    <p>{lastName}</p>
    <p>{avg}</p>
  </div>
}
