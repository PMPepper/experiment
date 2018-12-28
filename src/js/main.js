import React from 'react';
import ReactDOM from 'react-dom';

import * as dom from './dom';
import core from '../css/core.scss';

//polyfills
import 'wicg-inert';


const title = 'React/Webpack testing';


import Test from '@/components/test/Test';


ReactDOM.render(
  <div style={{padding: '16px'}}>
    <h1>{title}</h1>
    <Test />
  </div>,
  document.getElementById('app')
);


if(process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
