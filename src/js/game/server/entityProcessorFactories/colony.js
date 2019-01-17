export default function colonyFactory(lastTime, time, init) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function colony(colony, entities) {
      if(colony.type === 'colony') {
        let i, l, totalPopulation = 0;

        //update population
        for(i = 0, l = colony.colony.populationIds.length; i < l; ++i) {
          const population = entities[colony.colony.populationIds[i]];
          const species = entities[population.speciesId];
          const dayGrowthRate = init ? 1 : Math.pow(species.species.growthRate, 1/365.25);

          //TODO affected by envirnoment
          //TODO do not grow on colony ships, transports etc

          population.population.quantity *= dayGrowthRate;

          totalPopulation += population.population.quantity;
        }

        colony.colony.totalPopulation = Math.floor(totalPopulation);


        return true;
      }

      return false;
    }
  }

  return null
}
