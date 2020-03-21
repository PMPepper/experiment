import React, {useMemo, useContext, useEffect, useCallback, useRef} from 'react';
import {Trans} from '@lingui/macro'
import {useSelector, useStore, shallowEqual} from 'react-redux'

import styles from './styles.scss';
import SystemMap from './SystemMap';

import WindowColonies from './WindowColonies';
import TechnologyDesignWindow from './TechnologyDesignWindow';
import GameTime from '@/components/game/GameTime';

import Panel from '@/components/panel/Panel';
import Button from '@/components/button/Button';
import Window from '@/components/window/ConnectedWindow';
import SortChildren from '@/components/sortChildren/SortChildren';

import Icon from '@/components/icon/Icon';
import AddContextMenu from '@/components/contextMenu/AddContextMenu';

import FPSStats from '@/components/dev/FPSStats';
//import Icon from '@/components/icon/Icon';
import Test from './Test';

//Hooks
import useActions from '@/hooks/useActions';

//helpers
import cloneOmittingProps from '@/helpers/react/clone-omitting-props';
import reduce from '@/helpers/object/reduce';
import sortArrayOnPropertyNumeric from '@/helpers/sorting/sort-array-on-property-numeric';

//reducers
import {open, close} from '@/redux/HORs/isOpen';
import {setFollowing as setSystemMapFollowing, setOptions as setSystemMapOptions} from '@/redux/reducers/systemMap';
import {setSelectedSystemId} from '@/redux/reducers/selectedSystemId';
import {setSelectedColonyId} from '@/redux/reducers/coloniesWindow';

//Client context
export const ClientContext = React.createContext(null);
ClientContext.displayName = 'ClientContext';

export function useClient() {
  return useContext(ClientContext);
}

const actions = {
  open,
  close,
  setSystemMapFollowing,
  setSystemMapOptions,
  setSelectedSystemId,
  setSelectedColonyId,
};

//The component
export default function Game({client}) {
  //c/onsole.log('render Game');
  const windowLastInteracted = useSelector(state => state.windowLastInteracted);
  const game = useSelector(state => state.game);
  const selectedSystemId = useSelector(state => state.selectedSystemId);

  const knownSystems = useSelector(state => reduce(state.entitiesByType.factionSystem, (output, factionSystem) => {
    if(factionSystem.factionId == state.factionId) {
      output.push(factionSystem);
    }

    return output;
  }, []), shallowEqual);


  const store = useStore();
  const storeRef = useRef();
  storeRef.current = store;

  const {
    open,
    close,
    setSystemMapFollowing,
    setSystemMapOptions,
    setSelectedSystemId,
    setSelectedColonyId,
  } = useActions(actions);

  const clientAPI = useMemo(() => {
    //expose methods of client to rest of the UI
    return {
      createColony: client.createColony,
      createResearchQueue: client.createResearchQueue,
      updateResearchQueue: client.updateResearchQueue,
      removeResearchQueue: client.removeResearchQueue,

      addBuildQueueItem: client.addBuildQueueItem,
      removeBuildQueueItem: client.removeBuildQueueItem,
      reorderBuildQueueItem: client.reorderBuildQueueItem,
      updateBuildQueueItem: client.updateBuildQueueItem,

      addComponentProject: client.addComponentProject,
    }
  }, [client]);

  const windowOrderIndexes = useMemo(() => {
    return windowLastInteracted.reduce((windowOrderIndexes, windowId, index) => {
      windowOrderIndexes[windowId] = index;

      return windowOrderIndexes
    }, {})
  }, [windowLastInteracted])

  //Callbacks

  const sortWindows = useCallback((a, b) => {
    return (windowOrderIndexes[a.props.reduxPath] || 0) - (windowOrderIndexes[b.props.reduxPath] || 0);
  }, [windowOrderIndexes])

  const getContextMenuItems = useCallback((e, entityScreenPositions) => {
    const items = [];

    const clickX = e.clientX;
    const clickY = e.clientY;

    //get all system bodies with r OR within mininmum of ...3 px?
    const minSystemBodyDist = 3;
    const clickedSystemBodies = [];

    //access redux state
    const state = storeRef.current.getState();
    const factionId = state.factionId;
    const systemBodies = state.entitiesByType.systemBody;
    const colonies = state.entitiesByType.colony;
    const factions = state.entitiesByType.faction;
    const factionEntityNames = state.factionEntityNames;

    entityScreenPositions.forEach(position => {
      const systemBody = systemBodies[position.id];

      if(systemBody) {
        const r = Math.max(minSystemBodyDist, position.r);

        const dx = position.x - clickX;
        const dy = position.y - clickY;

        const d = (dx * dx) + (dy * dy);

        if(d <= (r * r)) {
          clickedSystemBodies.push({d, systemBody});
        }
      }
    });

    sortArrayOnPropertyNumeric(clickedSystemBodies, 'd');

    //
    clickedSystemBodies.forEach(({systemBody}) => {
      const systemBodyItem = {
        label: factionEntityNames[systemBody.id],
        icon: <Icon icon="globe" />,
        items: []
      };

      //Colonies stuff
      if(systemBody.systemBody.type !== 'star') {
        //Get all colonies on this system body
        const coloniesOnSystemBody = reduce(colonies, (output, colony) => {
          if(colony.systemBodyId === systemBody.id) {
            output.push(colony);
          }

          return output;
        }, [])

        let hasOwnColony = false;

        coloniesOnSystemBody.forEach(colony => {
          if(colony.factionId === factionId) {
            hasOwnColony = true;
          }

          systemBodyItem.items.push({
            label: factions[colony.factionId].faction.name,
            action: colony.factionId === factionId ? () => {
              setSelectedColonyId(colony.id);//and select this colony
              setSystemMapFollowing(colony.systemBodyId);
              //open('coloniesWindow');//open up colonies window
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
  }, []);

  useEffect(() => {
    //DEV CODE
    setSelectedColonyId(900);//and select this colony
    setSystemMapFollowing(5);
    open('coloniesWindow');//open up colonies window
    //open('technologyDesignWindow');//open up colonies window
    //END DEV CODE
  }, [])

  return <ClientContext.Provider value={clientAPI}>
    <div className={styles.game}>
      <AddContextMenu key={selectedSystemId} getItems={getContextMenuItems}>
        <SystemMap systemId={selectedSystemId} setFollowing={setSystemMapFollowing} />
      </AddContextMenu>
      <div className={styles.toolbar}>
        <div className="hspaceStart">
          <Button onClick={() => {open('coloniesWindow')}}><Trans id="toolbar.colonies">Colonies</Trans></Button>
          <Button onClick={() => {open('fleetsWindow')}}><Trans id="toolbar.fleets">Fleets</Trans></Button>
          <Button onClick={() => {open('shipDesignWindow')}}><Trans id="toolbar.shipDesign">Ship design</Trans></Button>
          <Button onClick={() => {open('technologyDesignWindow')}}><Trans id="toolbar.technologyDesign">Design technology</Trans></Button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className="vspaceStart">
          <div className="hspaceStart">
            <Button selected={!!game.isPaused} onClick={() => {client.setIsPaused(!game.isPaused)}}>
              <span className="offscreen"><Trans id="toolbar.togglePaused">Toggle paused game</Trans></span>
              <Icon icon="pause" />
            </Button>

            <Button selected={game.desiredGameSpeed === 1} onClick={() => {client.setDesiredSpeed(1)}}>
              <span className="offscreen"><Trans id="toolbar.realTime">Play at real time</Trans></span>
              <Icon icon="play" />
            </Button>

            <Button selected={game.desiredGameSpeed === 2} onClick={() => {client.setDesiredSpeed(2)}}>
              <span className="offscreen"><Trans id="toolbar.x60">Play at 1 minute per second</Trans></span>
              <Icon icon="play" />
              <Icon icon="play" />
            </Button>

            <Button selected={game.desiredGameSpeed === 3} onClick={() => {client.setDesiredSpeed(3)}}>
              <span className="offscreen"><Trans id="toolbar.x3600">Play at 1 hour per second</Trans></span>
              <Icon icon="play" />
              <Icon icon="play" />
              <Icon icon="play" />
            </Button>

            <Button selected={game.desiredGameSpeed === 4} onClick={() => {client.setDesiredSpeed(4)}}>
              <span className="offscreen"><Trans id="toolbar.x86400">Play at 1 day per second</Trans></span>
              <Icon icon="play" />
              <Icon icon="play" />
              <Icon icon="play" />
              <Icon icon="play" />
            </Button>

            <Button selected={game.desiredGameSpeed === 5} onClick={() => {client.setDesiredSpeed(5)}}>
              <span className="offscreen"><Trans id="toolbar.x86400">Play at 1 day per second</Trans></span>
              <Icon icon="play" />
              <Icon icon="play" />
              <Icon icon="play" />
              <Icon icon="play" />
              <Icon icon="play" />
            </Button>
          </div>
          <GameTime />
        </div>
      </div>

      <div className={styles.selectSystem}>
        <select value={selectedSystemId} onChange={(e) => {setSelectedSystemId(+e.target.value)}}>
          {knownSystems.map(knownSystem => (<option value={knownSystem.systemId} key={knownSystem.systemId}>{knownSystem.factionSystem.name}</option>))}
        </select>
      </div>

      <Panel title={<Trans id="optionsPanel.title">Options</Trans>} className={styles.options}>[TODO options panel]</Panel>

      <SortChildren sort={sortWindows}>
        <Window style={{width: '90%', maxWidth: '120rem'}} reduxPath="coloniesWindow" title={<Trans id="coloniesWindow.title">Colonies</Trans>}>
          <WindowColonies />
        </Window>
        <Window reduxPath="fleetsWindow" title={<Trans id="fleetsWindow.title">Fleets</Trans>}>TODO fleets window!</Window>
        <Window reduxPath="shipDesignWindow" title={<Trans id="shipDesignWindow.title">Ship design</Trans>}>TODO ship design window!</Window>
        <Window style={{width: '90%', maxWidth: '60rem'}} reduxPath="technologyDesignWindow" title={<Trans id="technologyDesignWindow.title">/Design technology</Trans>}>
          <TechnologyDesignWindow />
        </Window>
      </SortChildren>
      <FPSStats isActive={true} />
      {/*<Test />*/}
    </div>
  </ClientContext.Provider>
}
