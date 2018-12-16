import React from 'react';
import ReactDOM from 'react-dom';

import Test from './components/test/Test';

const title = 'Testing CSS modules';

ReactDOM.render(
  <div>
    <h1>{title}</h1>
    <p>Hello world blah blah blah!</p>
    <Test />
  </div>,
  document.getElementById('app')
);


if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
