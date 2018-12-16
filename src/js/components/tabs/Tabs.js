import React from 'react';
import {compose} from 'recompose';
import styles from './styles.css';


function Tabs({children}) {
  return <div role="tablist" aria-orientation="horizontal" className={styles.tabs}>
    {children}
  </div>
}

export default compose()(Tabs);


export const Display = Tabs;
