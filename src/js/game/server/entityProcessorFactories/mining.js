import EntityProcessor from '@/game/server/EntityProcessor';

import getColoniesBySystemBody from '@/helpers/app/getColoniesBySystemBody';
import forEach from '@/helpers/object/forEach';

import {DAY_ANNUAL_FRACTION} from '@/game/Consts';


function miningTest(entity) {
  return entity.type === 'colony';
}

function miningFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function miningProcessor(colony, entities, gameConfig) {
      const colonyMiningProduction = colony.colony.capabilityProductionTotals.mining;

      if(colonyMiningProduction <= 0) {
        return false;//no need to do anything for a colony that does not produce any minerals
      }

      const systemBody = entities[colony.systemBodyId];
      const allColoniesOnBody = getColoniesBySystemBody(colony.systemBodyId, entities);
      const totalSystemBodyMiningProduction = allColoniesOnBody.reduce(
        (total, colony) => {
          return total + colony.colony.capabilityProductionTotals.mining
        },
        0
      );

      forEach(gameConfig.minerals, (mineralName, mineralId) => {
        const systemBodyMinerals = systemBody.availableMinerals[mineralId];

        //total production across all colonies
        const globalDailyProduction = totalSystemBodyMiningProduction * systemBodyMinerals.access * DAY_ANNUAL_FRACTION;

        //If production exceeds available quantity, share equally amongst all colonies
        const maxFraction = (globalDailyProduction > systemBodyMinerals.quantity) ? colonyMiningProduction / totalSystemBodyMiningProduction : 1;

        //add minerals to colony (systemBody will be decreased by next entityProcessor)
        colony.colony.minerals[mineralId] += colonyMiningProduction * systemBodyMinerals.access * DAY_ANNUAL_FRACTION * maxFraction;
      })
      
      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(miningTest, miningFactory));
