import React from 'react';
import {Trans} from '@lingui/macro'

import styles from './windowShipbuilding.scss';

//Components
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import ColonyShipyards from './tables/ColonyShipyards';

//Helpers
import getPopulationName from '@/helpers/app-ui/get-population-name';

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

  const gameConfig = clientState.gameConfig;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const shipyardRows = colony.shipyardIds.map(shipyardId => {
    const shipyard = clientState.entities[shipyardId];

    return {
      name: shipyard.shipyard.name,
      isMilitary: shipyard.shipyard.isMilitary,
      capacity: shipyard.shipyard.capacity,
      slipways: shipyard.shipyard.slipways,
      speciesName: getPopulationName(shipyard.populationId, clientState.entities)
    };
  });//TODO


  return <div className="vspaceStart">
    <h2 className={styles.title}><Trans>Shipyards</Trans></h2>
    <ReduxDataTableState path="coloniesWindow.shipyardsTable">
      <ColonyShipyards rows={shipyardRows} />
    </ReduxDataTableState>

    <h2 className={styles.title}><Trans>Add shipyard project</Trans></h2>
    <div>TODO</div>
  </div>
}
