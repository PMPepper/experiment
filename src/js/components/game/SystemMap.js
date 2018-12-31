import React from 'react';
import {compose} from 'recompose';

import styles from './styles.scss';

import WindowSizeComponent from '@/HOCs/WindowSizeComponent';


function SystemMap({windowSize}) {
  return <canvas className={styles.systemMap} {...windowSize} ref={(ref) => {
    if(ref) {
      const ctx = ref.getContext('2d');

      ctx.fillStyle = 'rgb(0, 0, 20)';
      ctx.fillRect(0, 0, windowSize.width, windowSize.height);

      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.fillRect(400, 100, 50, 50);

      ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
      ctx.fillRect(430, 130, 50, 50);
    }
  }}></canvas>
}


export default compose(
  WindowSizeComponent()
)(SystemMap);
