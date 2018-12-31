import React from 'react';
import { Trans } from "@lingui/macro"

import styles from './styles.scss';
import SystemMap from './SystemMap';

import Panel from '@/components/panel/Panel';
import Button from '@/components/button/Button';


export default function Game() {
  return <div className={styles.game}>
    <div className={styles.toolbar}>
      <div className="hspaceStart">
        <Button><Trans id="toolbar.colonies">Colonies</Trans></Button>
        <Button><Trans id="toolbar.research">Research</Trans></Button>
        <Button><Trans id="toolbar.fleets">Fleets</Trans></Button>
        <Button><Trans id="toolbar.shipDesign">Ship design</Trans></Button>
      </div>
    </div>
    <div className={styles.controls}>[TODO controls]</div>
    <div className={styles.selectSystem}>[TODO Sol]</div>
    <Panel title={<Trans id="optionsPanel.title">Options</Trans>} className={styles.options}>[TODO options panel]</Panel>
    <SystemMap />
  </div>
}
