import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro"

import styles from './styles.scss';
import SystemMap from './SystemMap';

import Panel from '@/components/panel/Panel';
import Button from '@/components/button/Button';
import Window from '@/components/window/ConnectedWindow';

//reducers
import {open, close} from '@/redux/HORs/isOpen';


function Game({open, close}) {
  return <div className={styles.game}>
    <div className={styles.toolbar}>
      <div className="hspaceStart">
        <Button onClick={() => {open('coloniesWindow')}}><Trans id="toolbar.colonies">Colonies</Trans></Button>
        <Button><Trans id="toolbar.research">Research</Trans></Button>
        <Button><Trans id="toolbar.fleets">Fleets</Trans></Button>
        <Button><Trans id="toolbar.shipDesign">Ship design</Trans></Button>
      </div>
    </div>
    <div className={styles.controls}>[TODO controls]</div>
    <div className={styles.selectSystem}>[TODO Sol]</div>
    <Panel title={<Trans id="optionsPanel.title">Options</Trans>} className={styles.options}>[TODO options panel]</Panel>
    <SystemMap />

    <Window reduxPath="coloniesWindow" title={<Trans id="coloniesWindow.title">Colonies</Trans>}>TODO colonies window!</Window>
  </div>
}

export default compose(
  connect(state => {
    return {}
  }, {
    open,
    close
  })
)(Game);
