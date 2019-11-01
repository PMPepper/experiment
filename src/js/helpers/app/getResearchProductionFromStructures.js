

//Helpers
import forEach from '@/helpers/object/forEach';

import calculateTechnologyModifiers from '@/game/server/entityProcessorFactories/colony/calculateTechnologyModifiers';

//TODO take into account population modifier
//TODO diminishing returns from additional structures?
//TODO adjust based on research modifiers?
export default function getResearchProductionFromStructures(structures, gameConfig, faction) {
  let total = 0;

  const technologyModifiers = calculateTechnologyModifiers(faction.faction.technology);
  const researchModifier = 1+(technologyModifiers.research || 0);

  forEach(structures, (quantity, structureTypeId) => {
    total += quantity * (gameConfig.structures[structureTypeId].capabilities.research || 0) * researchModifier
  })

  return total;
}
