import React from 'react';
import ReactDOM from 'react-dom';
import {I18nProvider} from '@lingui/react';
import {createStore} from 'redux';
import {Provider} from 'react-redux'

import * as dom from './dom';
import polyfills from './polyfills';
import core from '../css/core.scss';

//App specific
import root from '@/redux/root';
import Game from '@/components/game/Game';

import * as GameEngine from '@/game/Game';

//vars
const title = 'React/Webpack testing';

const store = createStore(root)
console.log(store);
console.log(store.getState());

const gameServer = GameEngine.startGame();

//TODO list:
//-finish datatables
//-add tooltips
//-add forms support


polyfills.then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <I18nProvider language="en-GB">
          <Game server={gameServer} factionId={1} />
        </I18nProvider>
      </Provider>,
      document.getElementById('app')
    );
  })
  /*.catch(error => {
    //TODO better error handling for failed polyfills loading
    console.error('Failed fetching polyfills ', error);
  });*/

if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
