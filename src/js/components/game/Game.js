import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Trans} from '@lingui/macro'

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
import Test from './Test';



//helpers
import cloneOmittingProps from '@/helpers/react/clone-omitting-props';
import sortArrayOnPropertyNumeric from '@/helpers/sorting/sort-array-on-property-numeric';

//reducers
import {open, close} from '@/redux/HORs/isOpen';
import {setFollowing as setSystemMapFollowing, setOptions as setSystemMapOptions} from '@/redux/reducers/systemMap';
import {setSelectedSystemId} from '@/redux/reducers/selectedSystemId';
import {setSelectedColonyId} from '@/redux/reducers/coloniesWindow';


function Game({
  coloniesWindow, fleetsWindow, shipDesignWindow,
  clientState, client,
  systemMap, setSystemMapFollowing, setSystemMapOptions,
  selectedSystemId, setSelectedSystemId,
  setSelectedColonyId,
  open, close
}) {
  const entities = clientState.entities;
  const entityIds = clientState.entityIds;

  return <div className={styles.game}>
    <AddContextMenu key={selectedSystemId} getItems={(e, entityScreenPositions) => {
      const items = [];

      const clickX = e.clientX;
      const clickY = e.clientY;

      const factionId = clientState.factionId;

      //get all system bodies with r OR within mininmum of ...3 px?
      const minSystemBodyDist = 3;
      const systemBodies = [];

      entityScreenPositions.forEach(position => {
        const entity = entities[position.id];

        if(entity.type === 'systemBody') {
          const r = Math.max(minSystemBodyDist, position.r);

          const dx = position.x - clickX;
          const dy = position.y - clickY;

          const d = (dx * dx) + (dy * dy);

          if(d <= (r * r)) {
            systemBodies.push({d, entity});
          }
        }
      });

      sortArrayOnPropertyNumeric(systemBodies, 'd');

      systemBodies.forEach(item => {
        const systemBody = item.entity;

        const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBody);


        const systemBodyItem = {
          label: factionSystemBody.factionSystemBody.name,
          icon: <Icon icon="globe" />,
          items: []
        };

        //Colonies stuff
        if(systemBody.systemBody.type !== 'star') {
          const colonies = clientState.getColoniesForSystemBody(systemBody) || [];

          let hasOwnColony = false;

          colonies.forEach(colony => {
            if(colony.factionId === factionId) {
              hasOwnColony = true;
            }

            systemBodyItem.items.push({
              label: entities[colony.factionId].faction.name,
              action: colony.factionId === factionId ? () => {
                setSelectedColonyId(colony.id);//and select this colony
                setSystemMapFollowing(colony.systemBodyId);
                open('coloniesWindow');//open up colonies window
              } : null
            });
          })

          if(!hasOwnColony) {
            systemBodyItem.items.unshift({
              label: <Trans>Create colony</Trans>,
              action: () => {
                client.createColony(systemBody.id);
              }
            })
          }

          systemBodyItem.items.push('spacer');
        }

        systemBodyItem.items.push({
          label: <Trans>Body info</Trans>,
          action: () => {alert('TODO')}
        });

        items.push(systemBodyItem);
      })


      return items;




      //
      // //Not happy with any of this... need to re-think context menu
      // let closestEntity = null;
      // let closestDistance = Number.POSITIVE_INFINITY;
      //
      // for(let i = 0; i < entityIds.length; i++) {
      //   const entity = entities[entityIds[i]];
      //
      //   if(entity.position) {
      //     let dx = systemPosition.x - entity.position.x;
      //     let dy = systemPosition.y - entity.position.y;
      //     let comparisonDistance = (dx * dx) + (dy * dy);//No need to sqrt if just comparing
      //
      //     if(comparisonDistance < closestDistance) {
      //       closestDistance = comparisonDistance;
      //       closestEntity = entity;
      //     }
      //   }
      // }
      //
      // const thresholdDistance = Math.pow(10 / zoom, 2)
      //
      // if(closestDistance < thresholdDistance) {
      //   e.preventDefault();
      //   const entityId = closestEntity.id//+e.target.dataset.entityId;
      //   const entity = entities[entityId];
      //   const factionId = clientState.factionId;
      //   const items = [];
      //
      //   if(entity.type === 'systemBody') {
      //     if(items.length > 0) {
      //       items.push('spacer');
      //     }
      //
      //     const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(entity);
      //     const colonies = clientState.getColoniesForSystemBody(entity);
      //     //const factions = clientState.factions;
      //
      //     items.push({label: factionSystemBody.factionSystemBody.name, icon: <Icon icon="globe" />});
      //     items.push({label: <Trans>Body info</Trans>, action: () => {alert('TODO')}})
      //
      //     if(entity.systemBody.type !== 'star') {
      //       let hasOwnColony = false;
      //
      //       const coloniesItems = colonies.map(colony => {
      //         if(colony.factionId === factionId) {
      //           hasOwnColony = true;
      //         }
      //
      //         return {
      //           label: entities[colony.factionId].faction.name,
      //           action: colony.factionId === factionId ? () => {
      //             setSelectedColonyId(colony.id);//and select this colony
      //             setSystemMapFollowing(colony.systemBodyId);
      //             open('coloniesWindow');//open up colonies window
      //           } : null
      //         }
      //       });
      //
      //       if(!hasOwnColony) {
      //         coloniesItems.unshift({label: <Trans>Create colony</Trans>, action: () => {
      //           client.createColony(entity.id);
      //         }})
      //       }
      //
      //       items.push({label: <Trans>Colonies</Trans>, items: coloniesItems});
      //     }
      //   }
      //
      //   return items;
      // }

      return false;
    }}>
      <SystemMap clientState={clientState} {...systemMap} systemId={selectedSystemId} setFollowing={setSystemMapFollowing} systemMapRef={(ref) => {console.log(ref)}} />
    </AddContextMenu>
    <div className={styles.toolbar}>
      <div className="hspaceStart">
        <Button onClick={() => {open('coloniesWindow')}}><Trans id="toolbar.colonies">Colonies</Trans></Button>
        <Button onClick={() => {open('fleetsWindow')}}><Trans id="toolbar.fleets">Fleets</Trans></Button>
        <Button onClick={() => {open('shipDesignWindow')}}><Trans id="toolbar.shipDesign">Ship design</Trans></Button>
      </div>
    </div>

    <div className={styles.controls}>
      <div className="vspaceStart">
        <div className="hspaceStart">
          <Button selected={!!clientState.isPaused} onClick={() => {client.setIsPaused(!clientState.isPaused)}}>
            <span className="offscreen"><Trans id="toolbar.togglePaused">Toggle paused game</Trans></span>
            <Icon icon="pause" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 1} onClick={() => {client.setDesiredSpeed(1)}}>
            <span className="offscreen"><Trans id="toolbar.realTime">Play at real time</Trans></span>
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 2} onClick={() => {client.setDesiredSpeed(2)}}>
            <span className="offscreen"><Trans id="toolbar.x60">Play at 1 minute per second</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 3} onClick={() => {client.setDesiredSpeed(3)}}>
            <span className="offscreen"><Trans id="toolbar.x3600">Play at 1 hour per second</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 4} onClick={() => {client.setDesiredSpeed(4)}}>
            <span className="offscreen"><Trans id="toolbar.x86400">Play at 1 day per second</Trans></span>
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
            <Icon icon="play" />
          </Button>

          <Button selected={clientState.desiredGameSpeed === 5} onClick={() => {client.setDesiredSpeed(5)}}>
            <span className="offscreen"><Trans id="toolbar.x86400">Play at 1 day per second</Trans></span>
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
      <Window lastInteracted={shipDesignWindow.lastInteracted} reduxPath="shipDesignWindow" title={<Trans id="shipDesignWindow.title">Ship design</Trans>}>TODO ship design window!</Window>
    </SortChildren>
    <FPSStats isActive={true} />
    <Test />
  </div>
}

export default compose(
  connect(state => {
    return {
      coloniesWindow: state.coloniesWindow,
      fleetsWindow: state.fleetsWindow,
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
