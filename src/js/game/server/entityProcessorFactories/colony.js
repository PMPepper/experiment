import forEach from '@/helpers/object/forEach';

const DAY_ANNUAL_FRACTION = 1/365.25

export default function colonyFactory(lastTime, time, init) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function colony(colony, entities, gameConfig) {
      if(colony.type === 'colony') {
        let i, l, totalPopulation = 0, totalEffectiveWorkers = 0, totalSupportWorkers = 0;

        const systemBody = entities[colony.systemBodyId];
        const factionSystemBody = entities[colony.factionSystemBodyId];

        //for each population
        for(i = 0, l = colony.colony.populationIds.length; i < l; ++i) {
          const population = entities[colony.colony.populationIds[i]];
          const species = entities[population.speciesId];
          const dayGrowthRate = init ? 1 : Math.pow(species.species.growthRate, DAY_ANNUAL_FRACTION);

          //TODO affected by envirnoment
          //TODO do not grow on colony ships, transports etc

          //update population
          population.population.quantity *= dayGrowthRate;

          const supportWorkers = population.population.quantity * species.species.support;//TODO calculate based on envirnoment
          const effectiveWorkers = (population.population.quantity - supportWorkers) * species.species.workerMultiplier;

          //keep track of totals
          totalPopulation += population.population.quantity;
          totalEffectiveWorkers += effectiveWorkers;
          totalSupportWorkers += supportWorkers
        }

        //record total workforce
        colony.colony.totalPopulation = Math.floor(totalPopulation);
        colony.colony.totalEffectiveWorkers = Math.floor(totalEffectiveWorkers);
        colony.colony.totalSupportWorkers = Math.floor(totalSupportWorkers);

        //structures
        const structureDefinitions = gameConfig.structures;
        const structuresWithCapability = {};//List of all structures with this capability
        const totalStructureCapabilities = {};//quantity for each capability/structure
        let totalRequiredWorkforce = 0;

        //for each type of structure in the colony...
        forEach(colony.colony.structures, (quantity, structureId) => {
          const structureDefinition = structureDefinitions[structureId];

          if(!structureDefinition) {
            throw new Error(`Unknown structure: '${structureId}'`);
          }

          //TODO disabled structures, industries, etc

          //record required workforce
          totalRequiredWorkforce += structureDefinition.workers * quantity;

          //for every type of thing (capability) this structure can do (e.g. mining, reseach, etc)...
          forEach(structureDefinition.capabilities, (value, capability) => {
            if(!(capability in totalStructureCapabilities)) {
              totalStructureCapabilities[capability] = 0;
              structuresWithCapability[capability] = {};
            }

            //...record the total for the colony of this action (e.g. total amount of mining we can perform, etc)...
            totalStructureCapabilities[capability] += value * quantity;

            //...AND record the quantities of structures that can perform this action (e.g. mining can be performed by 3 basic mines, 14 PE mines)
            structuresWithCapability[capability][structureId] = quantity;
          });
        });//end foreach structure type

        //record totals
        colony.colony.totalStructureCapabilities = totalStructureCapabilities;
        colony.colony.structuresWithCapability = structuresWithCapability;

        const labourEfficiency = Math.min(1, Math.floor(totalEffectiveWorkers) / totalRequiredWorkforce);

        //mining
        if(totalStructureCapabilities.mining && factionSystemBody.factionSystemBody.isSurveyed) {
          //can mine
          //-how much you can mine per year
          //-TODO automated mines not effected by labour shortage
          const miningProduction = totalStructureCapabilities.mining * labourEfficiency * 1;//TODO include species mining rate here + any other adjustments (morale etc)

          forEach(gameConfig.minerals, (mineralName, mineralId) => {
            const systemBodyMinerals = systemBody.availableMinerals[mineralId];
            let dailyProduction = miningProduction * systemBodyMinerals.access * DAY_ANNUAL_FRACTION;

            if(dailyProduction > systemBodyMinerals.quantity) {
              dailyProduction = systemBodyMinerals.quantity
            }

            colony.minerals[mineralId] = colony.minerals[mineralId] + dailyProduction;

            //TODO modified a different entity????
            //TODO needs to be done in a different processor
            systemBody.availableMinerals[mineralId].quantity -= dailyProduction;
          })

          colony.colony.miningProduction = miningProduction;
        }


        return true;
      }

      return false;
    }
  }

  return null
}
