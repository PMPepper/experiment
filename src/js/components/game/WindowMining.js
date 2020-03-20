import React, {useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';
import {useSelector} from 'react-redux'

import styles from './windowMining.scss';

//Components
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Table from '@/components/table/Table';
import FormatNumber from '@/components/formatNumber/FormatNumber';
import ReduxDataTableState from '@/components/datatable/ReduxDataTableState';
import ColonyMineralsTable from './tables/ColonyMinerals';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';
import jsonComparison from '@/helpers/object/json-comparison';

//Helpers
import map from '@/helpers/object/map';
import roundToDigits from '@/helpers/math/round-to-digits';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import sortStructuresByNameAndSpecies from '@/helpers/app-ui/sort-structures-by-name-and-species';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';
import getPopulationName from '@/helpers/app-ui/get-population-name';


//The component
export default function WindowMining({colonyId}) {
  const gameConfig = useSelector(state => state.game.gameConfig);
  const colony = useSelector(state => state.entities.byId[colonyId]);
  const systemBodyMinerals = useSelector(
    state => state.entities.byId[colony.systemBodyId].availableMinerals,
    jsonComparison
  );
  const factionSystemBody = useSelector(state => state.game.entities[colony.factionSystemBodyId]);
  const faction = useSelector(state => state.entities.byId[state.factionId]);
  const populations = useSelector(state => state.entitiesByType.population);
  const species = useSelector(state => state.entitiesByType.species);

  const i18n = useI18n();

  const hasMultiplePopulations = colony.populationIds.length > 1;

  const isMineralsSurveyed = factionSystemBody.factionSystemBody.isSurveyed;

  const colonyMiningStructures = getColonyStructuresCapabilities(colony, 'mining');
  const totalColonyMiningFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.mining} />;

  //Mineral rows
  const mineralsRows = isMineralsSurveyed ? map(gameConfig.minerals, (mineral, mineralId) => {
    const systemBodyMineral = systemBodyMinerals[mineralId];
    const dailyProduction = (colony.colony.capabilityProductionTotals.mining || 0) * systemBodyMineral.access;

    return {
      mineral,
      quantity: Math.ceil(systemBodyMineral.quantity),
      access: systemBodyMineral.access,
      production: dailyProduction,
      depletion: dailyProduction > 0 ? roundToDigits(systemBodyMineral.quantity / (dailyProduction * 365.25), 3) : Number.NaN,
      stockpile: Math.floor(colony.colony.minerals[mineralId]),
    };
  }) : null;

  return <div className="vspaceStart">
    <h2 className={styles.title}><Trans>Colony mining facilities</Trans></h2>
    <div className={styles.structures}>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.TH><Trans>Structure</Trans></Table.TH>
            {hasMultiplePopulations && <Table.TH><Trans>Species</Trans></Table.TH>}
            <Table.TH><Trans>#</Trans></Table.TH>
            <Table.TH><Trans>Mining/facility/mineral/day</Trans></Table.TH>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {colonyMiningStructures
            .sort(sortStructuresByNameAndSpecies(i18n.language, populations, species, gameConfig))
            .filter(({quantity}) => (quantity > 0))
            .map(({populationId, structureId, quantity}) => {
              const availableFormatted = <FormatNumber value={+quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'mining', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{getPopulationName(populationId, populations, species)}</Table.TD>}
                <Table.TD><Trans>{availableFormatted}</Trans></Table.TD>
                <Table.TD><FormatNumber value={+rps} /></Table.TD>
              </Table.Row>
            })
          }
        </Table.TBody>
        <Table.TFoot>
          <Table.Row>
            <Table.TD colSpan={hasMultiplePopulations ? 4 : 3}>
              <div className="alignEnd"><Trans>Colony total mining production: {totalColonyMiningFormatted}/mineral availablity</Trans></div>
            </Table.TD>
          </Table.Row>
        </Table.TFoot>
      </Table>
    </div>

    <h2 className={styles.title}><Trans>Mineral stockpile and production</Trans></h2>
    <div className={styles.minerals}>
      {isMineralsSurveyed ?//TODO But what if I have a stockpile on this planet?
        <ReduxDataTableState path="coloniesWindow.mineralsTable">
          <ColonyMineralsTable rows={mineralsRows} />
        </ReduxDataTableState>
        :
        <span><Trans>System body not surveyed</Trans></span>
      }
    </div>
  </div>





}
