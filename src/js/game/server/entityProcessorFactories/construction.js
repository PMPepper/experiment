import EntityProcessor from '@/game/server/EntityProcessor';

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

      //calc total remaining BP needed to finish queue
      //do not build more than this

      //increment construction progress
      if(!buildInProgress[buildQueueItem.structureId]) {
        buildInProgress[buildQueueItem.structureId] = 0;
      }

      //TODO mineral availability
      //colony.colony.minerals
      //calc req. minerals
      //if they are available
      //decrement colony minerals
      //increment build progress
      buildInProgress[buildQueueItem.structureId] += colonyConstructionProduction;

      let haveBuilt = Math.floor(buildInProgress[buildQueueItem.structureId] / structure.bp);



      if(haveBuilt > 0) {
        if(haveBuilt > remainsToBuild) {
          haveBuilt = remainsToBuild;
        }
        //reduce construction progress
        //buildInProgress[buildQueueItem.structureId] -= haveBuilt * structure.bp;
        //add structures to colony
        //colony.colony.structures[buildQueueItem.structureId] = (colony.colony.structures[buildQueueItem.structureId] || 0) + haveBuilt
      }

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(constructionTest, constructionFactory));
