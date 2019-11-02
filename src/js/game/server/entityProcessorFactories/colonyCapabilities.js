import EntityProcessor from '@/game/server/EntityProcessor';
import calculatePopulationProductionCapabilites from '@/game/server/entityProcessorFactories/colony/calculatePopulationProductionCapabilites';
import calculateTechnologyModifiers from '@/game/server/entityProcessorFactories/colony/calculateTechnologyModifiers';


function colonyCapabilitiesTest(entity) {
  return entity.type === 'colony';
}

function colonyCapabilitiesFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function colonyCapabilitiesProcessor(colony, entities, gameConfig) {
      let i, l, totalPopulation = 0, totalEffectiveWorkers = 0, totalSupportWorkers = 0;

      const faction = entities[colony.factionId];
      const technologyModifiers = calculateTechnologyModifiers(faction.faction.technology, gameConfig.technology);
      const structureDefinitions = gameConfig.structures;

      const capabilityProductionTotals = {};//the total procution this colony is capable of for each capability (mining, research, etc)
      const structuresWithCapability = {};//total structures for each capability [capability][structureId] = number of structures

      //for each population, calculate total number of workers and production output
      for(i = 0, l = colony.populationIds.length; i < l; ++i) {
        let population = entities[colony.populationIds[i]];

        //keep track of totals
        totalPopulation += population.population.quantity;
        totalEffectiveWorkers += population.population.effectiveWorkers;
        totalSupportWorkers += population.population.supportWorkers;

        let populationProductionTotals = calculatePopulationProductionCapabilites(colony, population.id, technologyModifiers, structureDefinitions, entities, capabilityProductionTotals, structuresWithCapability);

        //record population production values
        colony.colony.populationCapabilityProductionTotals[population.id] = populationProductionTotals.capabilityProductionTotals;
        colony.colony.populationStructuresWithCapability[population.id] = populationProductionTotals.structuresWithCapability;
        colony.colony.populationUnitCapabilityProduction[population.id] = populationProductionTotals.unitCapabilityProduction;
      }

      //calculate production for structures that do not have a population (e.g. automated miners)
      const automatedProductionTotals = calculatePopulationProductionCapabilites(colony, 0, technologyModifiers, structureDefinitions, entities, capabilityProductionTotals, structuresWithCapability);

      //record automated production values
      colony.colony.populationCapabilityProductionTotals[0] = automatedProductionTotals.capabilityProductionTotals;
      colony.colony.populationStructuresWithCapability[0] = automatedProductionTotals.structuresWithCapability;
      colony.colony.populationUnitCapabilityProduction[0] = automatedProductionTotals.unitCapabilityProduction;

      //record total workforce
      colony.colony.totalPopulation = Math.floor(totalPopulation);
      colony.colony.totalEffectiveWorkers = Math.floor(totalEffectiveWorkers);
      colony.colony.totalSupportWorkers = Math.floor(totalSupportWorkers);

      //record total production
      colony.colony.capabilityProductionTotals = capabilityProductionTotals;
      colony.colony.structuresWithCapability = structuresWithCapability;

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(colonyCapabilitiesTest, colonyCapabilitiesFactory));
