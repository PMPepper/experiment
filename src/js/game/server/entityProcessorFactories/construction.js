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

      if(colonyConstructionProduction <= 0) {
        return false;//no need to do anything for a colony that does not produce any minerals
      }




      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(constructionTest, constructionFactory));
