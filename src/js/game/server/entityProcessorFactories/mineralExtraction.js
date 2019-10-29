import EntityProcessor from '@/game/server/EntityProcessor';

import calculateSystemBodyGlobalMiningRate from '@/game/server/entityProcessorFactories/colony/calculateSystemBodyGlobalMiningRate';
import forEach from '@/helpers/object/forEach';

import {DAY_ANNUAL_FRACTION} from '@/game/Consts';

function mineralExtractionTest(entity) {
  return !!entity.availableMinerals && entity.colonyIds && entity.colonyIds.length > 0;
}

function mineralExtractionFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function mineralExtractionProcessor(systemBody, entities, gameConfig) {
      const totalSystemBodyMiningRate = calculateSystemBodyGlobalMiningRate(systemBody, entities);

      if(totalSystemBodyMiningRate <= 0) {
        return false;//nothing doing any mining here!
      }

      forEach(gameConfig.minerals, (mineralName, mineralId) => {
        const systemBodyMinerals = systemBody.availableMinerals[mineralId];

        //total production across all colonies
        const globalDailyProduction = totalSystemBodyMiningRate * systemBodyMinerals.access * DAY_ANNUAL_FRACTION;

        //reduce available minerals (clamp at 0)
        systemBody.availableMinerals[mineralId].quantity = Math.max(0, systemBody.availableMinerals[mineralId].quantity - globalDailyProduction);
      })

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(mineralExtractionTest, mineralExtractionFactory));
