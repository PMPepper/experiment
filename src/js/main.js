import React from 'react';
import ReactDOM from 'react-dom';

import Test from './components/test/Test';
import Tabs from './components/tabs/Tabs';

import core from '../css/core.css';

const title = 'Testing CSS modules';

ReactDOM.render(
  <div>
    <h1>{title}</h1>
    <h2>Tabs test</h2>
    <Tabs>
      <p key="tab1" tab-title="Hello world">This is a tab content for the first tab.</p>
      <p key="tab2" tab-title="Foo bar">This is a tab content for the second tab.</p>
      <p key="tab3" tab-title="Tab three">This is a tab content for the <b>third</b> tab.</p>
    </Tabs>
  </div>,
  document.getElementById('app')
);


if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
