import EntityProcessor from '@/game/server/EntityProcessor';

//Helpers
import map from '@/helpers/object/map';
import forEach from '@/helpers/object/forEach';
import reduce from '@/helpers/object/reduce';
import every from '@/helpers/object/every';


//The processor
function constructionTest(entity) {
  return entity.type === 'colony';
}

function constructionFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function constructionProcessor(colony, entityManager, gameConfig) {
      const colonyConstructionProduction = colony.colony.capabilityProductionTotals.construction;

      if(colonyConstructionProduction <= 0 || colony.colony.buildQueue.length === 0) {
        return false;//no need to do anything for a colony that does not produce any construction, or has nothing queued
      }

      let remainsToBuild = 0;

      //find and remove completed build queue items at the start of the queue, or items missing their prerequisites
      while(colony.colony.buildQueue.length > 0) {
        const buildQueueItem = colony.colony.buildQueue[0];
        remainsToBuild = buildQueueItem.total - colony.colony.buildQueue[0].completed;

        if(remainsToBuild <= 0) {
          colony.colony.buildQueue.shift();//this build queue item is finished
          continue
        }

        //check that required source buildings (if any) are available

        const constructionProject = gameConfig.constructionProjects[buildQueueItem.constructionProjectId]

        const hasAllRequiredStructures = every(constructionProject.requiredStructures, (quantity, requiredStructureId) => {
          return ((colony.colony.structures[buildQueueItem.takeFromPopulationId] || {})[requiredStructureId] || 0) >= quantity
        });

        if(!hasAllRequiredStructures) {
          debugger;
          colony.colony.buildQueue.shift();//this build queue item is finished
          continue
        }

        //If we get here, this build queue item is fine
        break;
      }

      //All build queue items were invalid
      if(colony.colony.buildQueue.length === 0) {
        return true;
      }

      const buildQueueItem = colony.colony.buildQueue[0];
      const buildInProgress = colony.colony.buildInProgress;
      const constructionProject = gameConfig.constructionProjects[buildQueueItem.constructionProjectId];


      //increment construction progress
      if(!buildInProgress[buildQueueItem.constructionProjectId]) {
        buildInProgress[buildQueueItem.constructionProjectId] = 0;
      }

      //calc total remaining BP needed to finish queue
      //do not build more than this
      const remainingBPs = (remainsToBuild * constructionProject.bp) - buildInProgress[buildQueueItem.constructionProjectId];
      const targetBPs = Math.min(colonyConstructionProduction, remainingBPs);//do not build more than you need

      //calc required minerals, and check if you have enough
      const mineralFract = targetBPs / constructionProject.bp;
      const requiredMinerals = map(constructionProject.minerals, required => required * mineralFract);
      const availableMineralsModifier = reduce(requiredMinerals, (currentAvailableMineralsModifier, required, mineral) => {
        const available = (colony.colony.minerals[mineral] || 0)
        const fract = available >= required ? 1 : available / required;

        return Math.min(currentAvailableMineralsModifier, fract);
      }, 1);

      //TODO Check we have enough required structures to build the items we have, and if not reduce produced structures
      //-we know we can build at least one already...

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
        const currentMinerals = colony.colony.minerals[mineral];
        const newMinerals = currentMinerals - quantity;

        colony.colony.minerals[mineral] = Math.max(0, newMinerals);
      })

      //now update construction
      if(effectiveBPs === remainingBPs) {//have finished this build queue
        //consume any required structures
        forEach(constructionProject.requiredStructures, (quantity, requiredStructureId) => {
          colony.colony.structures[buildQueueItem.takeFromPopulationId][requiredStructureId] -= remainsToBuild * quantity;
        });

        //increment built structures
        forEach(constructionProject.producedStructures, (quantity, producedStructureId) => {
          colony.colony.structures[buildQueueItem.assignToPopulationId][producedStructureId] += remainsToBuild * quantity;
        });

        //shipyards
        if(constructionProject.shipyard) {
          //TODO create shipyard entity
        }

        //clear progress
        buildInProgress[buildQueueItem.constructionProjectId] = 0;

        //remove from build queue
        colony.colony.buildQueue.shift();
      } else {//still in progress
        //-increment progress
        buildInProgress[buildQueueItem.constructionProjectId] += effectiveBPs;
        //-are any finished?
        const numBuilt = Math.floor(buildInProgress[buildQueueItem.constructionProjectId] / constructionProject.bp);

        if(numBuilt > 0) {
          //-some are finished, update colony + build queue to reflect progress
          //-consume required structures
          forEach(constructionProject.requiredStructures, (quantity, requiredStructureId) => {
            colony.colony.structures[buildQueueItem.takeFromPopulationId][requiredStructureId] -= numBuilt * quantity;
          });

          //-increment built structures
          forEach(constructionProject.producedStructures, (quantity, producedStructureId) => {
            colony.colony.structures[buildQueueItem.assignToPopulationId][producedStructureId] += numBuilt * quantity;
          });

          //shipyards
          if(constructionProject.shipyard) {
            //TODO create shipyard entity
          }

          buildInProgress[buildQueueItem.constructionProjectId] %= constructionProject.bp;
          buildQueueItem.completed += numBuilt;
        }
      }

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(constructionTest, constructionFactory));
