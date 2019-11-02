
export default function getCapabilityProductionForColonyPopulationStructure(colony, capability, populationId, structureId) {
  const populationUnitCapabilityProduction = colony.colony.populationUnitCapabilityProduction

  return (
    populationUnitCapabilityProduction[populationId] &&
    populationUnitCapabilityProduction[populationId][capability] &&
    populationUnitCapabilityProduction[populationId][capability][structureId]
  ) || 0;

}
