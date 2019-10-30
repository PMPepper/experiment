import EntityProcessor from '@/game/server/EntityProcessor';

function researchTest(entity) {
  return entity.type === 'colony';
}

function researchFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function researchProcessor(colony, entities, gameConfig) {
      const colonyResearchProduction = colony.colony.capabilityProductionTotals.research;

      if(colonyResearchProduction <= 0) {
        return false;//no need to do anything for a colony that does not produce any minerals
      }

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(researchTest, researchFactory));
