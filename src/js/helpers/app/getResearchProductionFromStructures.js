
//Helpers
import forEach from '@/helpers/object/forEach';

//TODO diminishing returns from additional structures?

export default function getResearchProductionFromStructures(structures, colony) {
  let total = 0;
  const populationUnitCapabilityProduction = colony.colony.populationUnitCapabilityProduction

  forEach(structures, (populationStructures, populationId) => {
    forEach(populationStructures, (quantity, structureId) => {
      total += quantity * populationUnitCapabilityProduction[populationId].research[structureId];
    })
  })

  return total;
}
