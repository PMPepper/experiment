import React from 'react';
import {Trans} from '@lingui/macro'
import {useSelector, shallowEqual} from 'react-redux'

import styles from './windowShipbuilding.scss';

//Components
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import ColonyShipyards from './tables/ColonyShipyards';

//Helpers
import getPopulationName from '@/helpers/app-ui/get-population-name';
import jsonComparison from '@/helpers/object/json-comparison';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import {useClient} from '@/components/game/Game';


//The component
export default function WindowShipbuilding({colonyId}) {
  const i18n = useI18n();
  const client = useClient();

  //Redux
  const gameConfig = useSelector(state => state.gameConfig);
  const colony = useSelector(state => state.entities.byId[colonyId]);
  const colonyShipyards = useSelector(state => {
    return colony.shipyardIds.reduce((output, shipyardId) => {
      output[shipyardId] = state.entitiesByType.shipyard[shipyardId].shipyard

      return output;
    }, {});
  }, jsonComparison);

  const colonyShipyardPopulationIds = useSelector(state => {
    return colony.shipyardIds.reduce((output, shipyardId) => {
      output[shipyardId] = state.entitiesByType.shipyard[shipyardId].populationId

      return output;
    }, {});
  }, shallowEqual)

  const populations = useSelector(state => state.entitiesByType.population);
  const species = useSelector(state => state.entitiesByType.species);

  const shipyardRows = colony.shipyardIds.map(shipyardId => {
    const shipyard = colonyShipyards[shipyardId];

    return {
      name: shipyard.name,
      isMilitary: shipyard.isMilitary,
      capacity: shipyard.capacity,
      slipways: shipyard.slipways,
      speciesName: getPopulationName(colonyShipyardPopulationIds[shipyardId], populations, species)
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
