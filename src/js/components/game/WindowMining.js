import React, {useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

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

//Helpers
import map from '@/helpers/object/map';
import roundToDigits from '@/helpers/math/round-to-digits';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import sortStructuresByNameAndSpecies from '@/helpers/app-ui/sort-structures-by-name-and-species';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';


//The component
export default function WindowMining({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));

  const i18n = useI18n();

  const gameConfig = clientState.initialGameState;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const hasMultiplePopulations = colony.populationIds.length > 1;

  const systemBody = clientState.entities[colony.systemBodyId]
  const factionSystemBody = clientState.getFactionSystemBodyFromSystemBody(systemBody);
  const isMineralsSurveyed = factionSystemBody.factionSystemBody.isSurveyed;

  const colonyMiningStructures = getColonyStructuresCapabilities(colony, 'mining');
  const totalColonyMiningFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.mining} />;

  //Mineral rows
  const mineralsRows = isMineralsSurveyed ? map(clientState.initialGameState.minerals, (mineral, mineralId) => {
    const systemBodyMinerals = systemBody.availableMinerals[mineralId];
    const dailyProduction = (colony.colony.capabilityProductionTotals.mining || 0) * systemBodyMinerals.access;

    return {
      mineral,
      quantity: Math.ceil(systemBodyMinerals.quantity),
      access: systemBodyMinerals.access,
      production: dailyProduction,
      depletion: dailyProduction > 0 ? roundToDigits(systemBodyMinerals.quantity / (dailyProduction * 365.25), 3) : Number.NaN,
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
            .sort(sortStructuresByNameAndSpecies(i18n.language, clientState.entities, gameConfig))
            .filter(({quantity}) => (quantity > 0))
            .map(({populationId, structureId, quantity}) => {
              const availableFormatted = <FormatNumber value={+quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'mining', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                {hasMultiplePopulations && <Table.TD>{clientState.entities[clientState.entities[populationId].speciesId].species.name}</Table.TD>}
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
