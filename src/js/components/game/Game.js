import React from 'react';

import styles from './styles.scss';
import SystemMap from './SystemMap';

import Panel from '@/components/panel/Panel';
import Button from '@/components/button/Button';


export default function Game() {
  return <div className={styles.game}>
    <div className={styles.toolbar}>
      <div className="hspaceStart">
        <Button>[Colonies]</Button>
        <Button>[Research]</Button>
        <Button>[Fleets]</Button>
        <Button>[Ship design]</Button>
        <Button>[Other]</Button>
      </div>
    </div>
    <div className={styles.controls}>[TODO controls]</div>
    <div className={styles.selectSystem}>[TODO Sol]</div>
    <Panel title={'[TODO options panel]'} className={styles.options}>[TODO options panel]</Panel>
    <SystemMap />
  </div>
}
