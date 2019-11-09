import React, {useState, useCallback} from 'react';
import {Trans} from '@lingui/macro';

import styles from './windowIndustry.scss';

//Components
import Layout, {Row, Cell} from '@/components/layout/Layout';
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Table from '@/components/table/Table';
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';
import useShallowEqualSelector from '@/hooks/useShallowEqualSelector';

//Helpers
import forEach from '@/helpers/object/forEach';
import getColonyStructuresCapabilities from '@/helpers/app/getColonyStructuresCapabilities';
import getCapabilityProductionForColonyPopulationStructure from '@/helpers/app/getCapabilityProductionForColonyPopulationStructure';


//The component
export default function WindowIndustry({colonyId}) {
  const {clientState, coloniesWindow} = useShallowEqualSelector(state => ({
    clientState: state.game,
    coloniesWindow: state.coloniesWindow,
  }));

  const i18n = useI18n();

  const gameConfig = clientState.initialGameState;
  //const researchAreas = gameConfig.researchAreas;
  const colony = clientState.entities[colonyId];
  const faction = clientState.entities[clientState.factionId];

  const colonyConstructionStructures = getColonyStructuresCapabilities(colony, 'construction');

  const totalColonyConstructionFormatted = <FormatNumber value={colony.colony.capabilityProductionTotals.construction} />;

  return <div className="vspaceStart">
    <h2 className={styles.title}><Trans>Colony construction facilities</Trans></h2>
    <div className={styles.structures}>
      <Table>
        <Table.THead>
          <Table.Row>
            <Table.TH><Trans>Structure</Trans></Table.TH>
            <Table.TH><Trans>Species</Trans></Table.TH>
            <Table.TH><Trans>#</Trans></Table.TH>
            <Table.TH><Trans>Production/facility</Trans></Table.TH>
          </Table.Row>
        </Table.THead>
        <Table.TBody>
          {colonyConstructionStructures
            .sort()//TODO sort on what?
            .map(({populationId, structureId, quantity}) => {
              const availableFormatted = <FormatNumber value={quantity} />
              const rps = getCapabilityProductionForColonyPopulationStructure(colony, 'construction', populationId, structureId);

              return <Table.Row key={`${populationId}-${structureId}`}>
                <Table.TD>{gameConfig.structures[structureId].name}</Table.TD>
                <Table.TD>{clientState.entities[clientState.entities[populationId].speciesId].species.name}</Table.TD>
                <Table.TD><Trans>{availableFormatted}</Trans></Table.TD>
                <Table.TD><FormatNumber value={rps} /></Table.TD>
              </Table.Row>
            })
          }
        </Table.TBody>
        <Table.TFoot>
          <Table.Row>
            <Table.TD colSpan="4">
              <div className="alignEnd"><Trans>Colony total RP: {totalColonyConstructionFormatted}</Trans></div>
            </Table.TD>
          </Table.Row>
        </Table.TFoot>
      </Table>
    </div>

    <h2 className={styles.title}><Trans>Colony construction queue</Trans></h2>
    <div className={styles.queue}>
    <Table>
      <Table.THead>
        <Table.Row>
          <Table.TH><Trans>Structure</Trans></Table.TH>
          <Table.TH><Trans>Built</Trans></Table.TH>
          <Table.TH><Trans>Total</Trans></Table.TH>
          <Table.TH><Trans>Progress</Trans></Table.TH>
          <Table.TH><Trans>ETA</Trans></Table.TH>
        </Table.Row>
      </Table.THead>
      <Table.TBody>
        {colony.colony.buildQueue.map(buildQueueItem => {
          return <Table.Row key={buildQueueItem.id}>
            <Table.TD>{gameConfig.structures[buildQueueItem.structureId].name}</Table.TD>
            <Table.TD>TODO</Table.TD>
            <Table.TD><FormatNumber value={buildQueueItem.total} /></Table.TD>
            <Table.TD>TODO</Table.TD>
            <Table.TD>TODO</Table.TD>
          </Table.Row>
        })}
      </Table.TBody>
      <Table.TFoot>
        <Table.Row>
          <Table.TD colSpan="5">
            <div className="alignEnd"><Trans>ETA: TODO</Trans></div>
          </Table.TD>
        </Table.Row>
      </Table.TFoot>
    </Table>
    </div>
  </div>;
}
