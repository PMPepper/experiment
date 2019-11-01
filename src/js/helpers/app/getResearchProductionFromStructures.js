
//Helpers
import forEach from '@/helpers/object/forEach';

//TODO diminishing returns from additional structures?

export default function getResearchProductionFromStructures(structures, gameConfig, populationUnitCapabilityProduction) {
  let total = 0;

  forEach(structures, (populationStructures, populationId) => {
    forEach(populationStructures, (quantity, structureId) => {
      total += quantity * populationUnitCapabilityProduction[populationId].research[structureId];//(gameConfig.structures[structureTypeId].capabilities.research || 0) * researchModifier
    })
  })

  return total;
}
