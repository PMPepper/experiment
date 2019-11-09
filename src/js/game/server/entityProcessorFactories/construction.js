import EntityProcessor from '@/game/server/EntityProcessor';

//Helpers
import map from '@/helpers/object/map';
import forEach from '@/helpers/object/forEach';
import reduce from '@/helpers/object/reduce';


//The processor
function constructionTest(entity) {
  return entity.type === 'colony';
}

function constructionFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function constructionProcessor(colony, entities, gameConfig) {
      const colonyConstructionProduction = colony.colony.capabilityProductionTotals.construction;

      if(colonyConstructionProduction <= 0 || colony.colony.buildQueue.length === 0) {
        return false;//no need to do anything for a colony that does not produce any construction, or has nothing queued
      }

      let remainsToBuild = 0;

      //find and remove completed build queue items at the start of the queue
      while(colony.colony.buildQueue.length > 0) {
        remainsToBuild = colony.colony.buildQueue[0].total - colony.colony.buildQueue[0].completed;

        if(remainsToBuild <= 0) {
          colony.colony.buildQueue.shift();//this build queue item is finished
        } else {
          break;//exit the loop
        }
      }

      const buildQueueItem = colony.colony.buildQueue[0];
      const buildInProgress = colony.colony.buildInProgress;
      const structure = gameConfig.structures[buildQueueItem.structureId];

      if(!colony.colony.structures[buildQueueItem.populationId]) {
        colony.colony.structures[buildQueueItem.populationId] = {};
      }

      if(!colony.colony.structures[buildQueueItem.populationId][buildQueueItem.structureId]) {
        colony.colony.structures[buildQueueItem.populationId][buildQueueItem.structureId] = 0;
      }

      //increment construction progress
      if(!buildInProgress[buildQueueItem.structureId]) {
        buildInProgress[buildQueueItem.structureId] = 0;
      }

      //calc total remaining BP needed to finish queue
      //do not build more than this
      const remainingBPs = (remainsToBuild * structure.bp) - buildInProgress[buildQueueItem.structureId];
      const targetBPs = Math.min(colonyConstructionProduction, remainingBPs);//do not build more than you need

      //calc required minerals, and if you have enough
      const mineralFract = targetBPs / structure.bp;
      const requiredMinerals = map(structure.minerals, required => required * mineralFract);
      const availableMineralsModifier = reduce(requiredMinerals, (currentAvailableMineralsModifier, required, mineral) => {
        const available = (colony.colony.minerals[mineral] || 0)
        const fract = available >= required ? 1 : available / required;

        return Math.min(currentAvailableMineralsModifier, fract);
      }, 1);

      let usedMinerals;
      let effectiveBPs;

      if(availableMineralsModifier === 1) {
        //minerals available
        usedMinerals = requiredMinerals;
        effectiveBPs = targetBPs;
      } else {
        //mineral shortage
        usedMinerals = map(requiredMinerals, quantity => quantity * availableMineralsModifier);
        effectiveBPs = targetBPs * availableMineralsModifier;
      }

      //reduce colony minerals
      forEach(usedMinerals, (quantity, mineral) => {
        colony.colony.minerals[mineral] = Math.ceil(0, colony.colony.minerals[mineral] - quantity);
      })

      //now update construction
      if(effectiveBPs === remainingBPs) {//have finished this build queue
        //increment built structures
        colony.colony.structures[buildQueueItem.populationId][buildQueueItem.structureId] += remainsToBuild;

        //clear progress
        buildInProgress[buildQueueItem.structureId] = 0;

        //remove from build queue
        colony.colony.buildQueue.shift();
      } else {//still in progress
        //-increment progress
        buildInProgress[buildQueueItem.structureId] += effectiveBPs;
        //-are any finished?
        const numBuilt = Math.floor(buildInProgress[buildQueueItem.structureId] / structure.bp);

        if(numBuilt > 0) {
          //-some are finished, update colony + build queue to reflect progress
          colony.colony.structures[buildQueueItem.populationId][buildQueueItem.structureId] += numBuilt;
          buildInProgress[buildQueueItem.structureId] %= structure.bp;
          buildQueueItem.completed += numBuilt;
        }
      }

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(constructionTest, constructionFactory));
