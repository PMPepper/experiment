import EntityProcessor from '@/game/server/EntityProcessor';
import calculatePopulationGrowth from '@/game/server/entityProcessorFactories/colony/calculatePopulationGrowth';

function populationGrowthTest(entity) {
  return entity.type === 'colony' && entity.populationIds && entity.populationIds.length > 0;
}

function populationGrowthFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function populationGrowthProcessor(colony, entities, gameConfig) {

      //for each population, calculate population growth, total number of workers and production output
      for(let i = 0, l = colony.populationIds.length; i < l; ++i) {
        let population = entities[colony.populationIds[i]];

        calculatePopulationGrowth(init, population, colony, entities);
      }

      return true;
    }

  }
  return null;
}


export default () => (new EntityProcessor(populationGrowthTest, populationGrowthFactory));
