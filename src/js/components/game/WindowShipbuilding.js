import React from 'react';
import {Trans} from '@lingui/macro'

import styles from './windowShipbuilding.scss';

//Components
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import ColonyShipyards from './tables/ColonyShipyards';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import {useClient} from '@/components/game/Game';


//The component
export default function WindowShipbuilding({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));

  const i18n = useI18n();
  const client = useClient();

  const gameConfig = clientState.initialGameState;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const shipyardRows = colony.shipyardIds.map(shipyardId => {
    const shipyard = clientState.entities[shipyardId];

    return {
      name: shipyard.shipyard.name,
      isMilitary: shipyard.shipyard.isMilitary,
      capacity: shipyard.shipyard.capacity,
      slipways: shipyard.shipyard.slipways,
    };
  });//TODO


  return <div className="vspaceStart">
    <h2 className={styles.title}><Trans>Shipyards</Trans></h2>
    <div>
    <ReduxDataTableState path="coloniesWindow.shipyardsTable">
      <ColonyShipyards rows={shipyardRows} />
    </ReduxDataTableState>
    </div>
  </div>
}
