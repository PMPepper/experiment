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
import Time from '@/components/time/Time';
import Icon from '@/components/icon/Icon';

import FPSStats from '@/components/dev/FPSStats';
//import Icon from '@/components/icon/Icon';



//helpers
import cloneOmittingProps from '@/helpers/react/clone-omitting-props';

//reducers
import {open, close} from '@/redux/HORs/isOpen';
import {setFollowing as setSystemMapFollowing, setOptions as setSystemMapOptions} from '@/redux/reducers/systemMap';


function Game({
  coloniesWindow, fleetsWindow, researchWindow, shipDesignWindow,
  game, client,
  systemMap, setSystemMapFollowing, setSystemMapOptions,
  open, close
}) {
  return <div className={styles.game}>
    <SystemMap entities={game.entities} {...systemMap} systemId={1} setFollowing={setSystemMapFollowing} />
    <div className={styles.toolbar}>
      <div className="hspaceStart">
        <Button onClick={() => {open('coloniesWindow')}}><Trans id="toolbar.colonies">Colonies</Trans></Button>
        <Button onClick={() => {open('researchWindow')}}><Trans id="toolbar.research">Research</Trans></Button>
        <Button onClick={() => {open('fleetsWindow')}}><Trans id="toolbar.fleets">Fleets</Trans></Button>
        <Button onClick={() => {open('shipDesignWindow')}}><Trans id="toolbar.shipDesign">Ship design</Trans></Button>
      </div>
    </div>

    <div className={styles.controls}>
      <div className="vspaceStart">
        <div className="hspaceStart">
          <Button selected={!!game.isPaused} onClick={() => {client.setIsPaused(!game.isPaused)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Toggle paused game</Trans></span>
            <Icon icon="pause" />
          </Button>

          <Button selected={game.desiredGameSpeed === 1} onClick={() => {client.setDesiredSpeed(1)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at real time</Trans></span>
            <Icon icon="play" />
          </Button>

          <Button selected={game.desiredGameSpeed === 2} onClick={() => {client.setDesiredSpeed(2)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x60</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={game.desiredGameSpeed === 3} onClick={() => {client.setDesiredSpeed(3)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x3,600</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={game.desiredGameSpeed === 4} onClick={() => {client.setDesiredSpeed(4)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x86,400</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={game.desiredGameSpeed === 5} onClick={() => {client.setDesiredSpeed(5)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x86,400</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>
        </div>
        <Time value={game.gameTimeDate} format="datetime" />
      </div>
    </div>

    <div className={styles.selectSystem}>
      <select>
        {game.knownSystems.map(knownSystem => (<option id={knownSystem.systemId} key={knownSystem.systemId}>{knownSystem.factionSystem.name}</option>))}
      </select>
    </div>

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

      systemMap: state.systemMap,
    }
  }, {
    open,
    close,
    setSystemMapFollowing,
    setSystemMapOptions,
  })
)(Game);
