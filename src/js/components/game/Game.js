import React from 'react';

import styles from './styles.scss';
import SystemMap from './SystemMap';

import Panel from '@/components/panel/Panel';


export default function Game() {
  return <div className={styles.game}>
    <div className={styles.toolbar}>[TODO toolbar]</div>
    <div className={styles.controls}>[TODO controls]</div>
    <div className={styles.selectSystem}>[TODO Sol]</div>
    <Panel title={'[TODO options panel]'} className={styles.options}>[TODO options panel]</Panel>
    <SystemMap />
  </div>
}
