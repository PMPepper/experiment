import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from "@lingui/macro"

import styles from './styles.scss';
import SystemMap from './SystemMap';

import WindowColonies from './WindowColonies';

import Panel from '@/components/panel/Panel';
import Button from '@/components/button/Button';
import Window from '@/components/window/ConnectedWindow';
import SortChildren from '@/components/sortChildren/SortChildren';
import Time from '@/components/time/Time';
import Icon from '@/components/icon/Icon';
import AddContextMenu from '@/components/contextMenu/AddContextMenu';

import FPSStats from '@/components/dev/FPSStats';
//import Icon from '@/components/icon/Icon';



//helpers
import cloneOmittingProps from '@/helpers/react/clone-omitting-props';

//reducers
import {open, close} from '@/redux/HORs/isOpen';
import {setFollowing as setSystemMapFollowing, setOptions as setSystemMapOptions} from '@/redux/reducers/systemMap';
import {setSelectedSystemId} from '@/redux/reducers/selectedSystemId';
import {setSelectedColonyId} from '@/redux/reducers/coloniesWindow';


function Game({
  coloniesWindow, fleetsWindow, researchWindow, shipDesignWindow,
  clientState, client,
  systemMap, setSystemMapFollowing, setSystemMapOptions,
  selectedSystemId, setSelectedSystemId,
  setSelectedColonyId,
  open, close
}) {
  return <div className={styles.game}>
    <AddContextMenu key={selectedSystemId} getItems={(e) => {
      if('entityId' in e.target.dataset) {
        e.preventDefault();
        const entityId = +e.target.dataset.entityId;
        const entity = clientState.entities[entityId];
        const factionId = clientState.factionId;
        const items = [];

        //alert(JSON.stringify(entity, null, 2));
        if(entity.type === 'systemBody') {
          if(items.length > 0) {
            items.push('spacer');
          }

          const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(entity);
          const colonies = clientState.getColoniesForSystemBody(entity);
          //const factions = clientState.factions;

          items.push({label: factionSystemBody.factionSystemBody.name, icon: <Icon icon="globe" />});
          items.push({label: <Trans>Body info</Trans>, action: () => {alert('TODO')}})

          if(entity.systemBody.type !== 'star') {
            let hasOwnColony = false;

            const coloniesItems = colonies.map(colony => {
              if(colony.factionId === factionId) {
                hasOwnColony = true;
              }

              return {
                label: clientState.entities[colony.factionId].faction.name,
                action: colony.factionId === factionId ? () => {
                  setSelectedColonyId(colony.id);//and select this colony
                  setSystemMapFollowing(colony.systemBodyId);
                  open('coloniesWindow');//open up colonies window
                } : null
              }
            });

            if(!hasOwnColony) {
              coloniesItems.unshift({label: <Trans>Create colony</Trans>, action: () => {
                client.createColony(entity.id);
              }})
            }

            items.push({label: <Trans>Colonies</Trans>, items: coloniesItems});
          }
        }

        return items;
      }

      return false;
    }}>
      <SystemMap clientState={clientState} {...systemMap} systemId={selectedSystemId} setFollowing={setSystemMapFollowing} />
    </AddContextMenu>
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
          <Button selected={!!clientState.isPaused} onClick={() => {client.setIsPaused(!clientState.isPaused)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Toggle paused game</Trans></span>
            <Icon icon="pause" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 1} onClick={() => {client.setDesiredSpeed(1)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at real time</Trans></span>
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 2} onClick={() => {client.setDesiredSpeed(2)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x60</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 3} onClick={() => {client.setDesiredSpeed(3)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x3,600</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 4} onClick={() => {client.setDesiredSpeed(4)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x86,400</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 5} onClick={() => {client.setDesiredSpeed(5)}}>
            <span className="offscreen"><Trans id="toolbar.colonies">Play at x86,400</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>
        </div>
        <Time value={clientState.gameTimeDate} format="datetime" />
      </div>
    </div>

    <div className={styles.selectSystem}>
      <select value={selectedSystemId} onChange={(e) => {setSelectedSystemId(+e.target.value)}}>
        {clientState.knownSystems.map(knownSystem => (<option value={knownSystem.systemId} key={knownSystem.systemId}>{knownSystem.factionSystem.name}</option>))}
      </select>
    </div>

    <Panel title={<Trans id="optionsPanel.title">Options</Trans>} className={styles.options}>[TODO options panel]</Panel>

    <SortChildren sort={(a, b) => (a.props.lastInteracted - b.props.lastInteracted)} mapChild={(child) => (cloneOmittingProps(child, ['lastInteracted']))}>
      <Window style={{width: '90%', maxWidth: '120rem'}} lastInteracted={coloniesWindow.lastInteracted} reduxPath="coloniesWindow" title={<Trans id="coloniesWindow.title">Colonies</Trans>}>
        <WindowColonies />
      </Window>
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
      clientState: state.game,

      systemMap: state.systemMap,
      selectedSystemId: state.selectedSystemId,
    }
  }, {
    open,
    close,
    setSystemMapFollowing,
    setSystemMapOptions,
    setSelectedSystemId,
    setSelectedColonyId,
  })
)(Game);
