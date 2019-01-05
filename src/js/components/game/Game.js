import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro"

import styles from './styles.scss';
import SystemMap from './SystemMap';

import Panel from '@/components/panel/Panel';
import Button from '@/components/button/Button';
import Window from '@/components/window/ConnectedWindow';
import SortChildren from '@/components/sortChildren/SortChildren';

import FPSStats from '@/components/dev/FPSStats';
//import Icon from '@/components/icon/Icon';



//helpers
import cloneOmittingProps from '@/helpers/react/clone-omitting-props';

//reducers
import {open, close} from '@/redux/HORs/isOpen';


function Game({
  coloniesWindow, fleetsWindow, researchWindow, shipDesignWindow,
  game,
  open, close
}) {
  return <div className={styles.game}>
    <SystemMap gameTime={game.gameTime} entities={game.entities} sysemMapOptions={systemMapOptions} />
    <div className={styles.toolbar}>
      <div className="hspaceStart">
        <Button onClick={() => {open('coloniesWindow')}}><Trans id="toolbar.colonies">Colonies</Trans></Button>
        <Button onClick={() => {open('researchWindow')}}><Trans id="toolbar.research">Research</Trans></Button>
        <Button onClick={() => {open('fleetsWindow')}}><Trans id="toolbar.fleets">Fleets</Trans></Button>
        <Button onClick={() => {open('shipDesignWindow')}}><Trans id="toolbar.shipDesign">Ship design</Trans></Button>
      </div>
    </div>

    <div className={styles.controls}>{game.gameTime.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>

    <div className={styles.selectSystem}>[TODO Sol]</div>

    <Panel title={<Trans id="optionsPanel.title">Options</Trans>} className={styles.options}>[TODO options panel]</Panel>

    <SortChildren sort={(a, b) => (a.props.lastInteracted - b.props.lastInteracted)} mapChild={(child) => (cloneOmittingProps(child, 'lastInteracted'))}>
      <Window lastInteracted={coloniesWindow.lastInteracted} reduxPath="coloniesWindow" title={<Trans id="coloniesWindow.title">Colonies</Trans>}>TODO colonies window!</Window>
      <Window lastInteracted={fleetsWindow.lastInteracted} reduxPath="fleetsWindow" title={<Trans id="fleetsWindow.title">Fleets</Trans>}>TODO fleets window!</Window>
      <Window lastInteracted={researchWindow.lastInteracted} reduxPath="researchWindow" title={<Trans id="researchWindow.title">Research</Trans>}>TODO research window!</Window>
      <Window lastInteracted={shipDesignWindow.lastInteracted} reduxPath="shipDesignWindow" title={<Trans id="shipDesignWindow.title">Ship design</Trans>}>TODO ship design window!</Window>
    </SortChildren>
    <FPSStats isActive={true} />
  </div>
}

export default compose(
  connect(state => {
    return {
      coloniesWindow: state.coloniesWindow,
      fleetsWindow: state.fleetsWindow,
      researchWindow: state.researchWindow,
      shipDesignWindow: state.shipDesignWindow,
      game: state.game,
    }
  }, {
    open,
    close
  })
)(Game);


//temp
import * as RenderFlags from './renderFlags';


const systemMapOptions = {
  asteroid: {
    body: RenderFlags.ALL,
    label: RenderFlags.ALL,
    orbit: 0
  },
  moon: {
    body: RenderFlags.ALL,
    label: RenderFlags.ALL,
    orbit: RenderFlags.ALL
  },
  planet: {
    body: RenderFlags.ALL,
    label: RenderFlags.ALL,
    orbit: RenderFlags.ALL
  },
  gasGiant: {
    body: RenderFlags.ALL,
    label: RenderFlags.ALL,
    orbit: RenderFlags.ALL
  },
  star: {
    body: RenderFlags.ALL,
    label: RenderFlags.ALL,
    orbit: RenderFlags.ALL
  },
};
