//Helpers
import reduce from '@/helpers/object/reduce';
import forEach from '@/helpers/object/forEach';


export default function getColonyAssignedResearchStructures(colony) {
  return reduce(colony.colony.assignedResearchStructures, (output, populationAssignedStructures) => {
    forEach(populationAssignedStructures, (structures, populationId) => {
      if(!output[populationId]) {
        output[populationId] = {};
      }

      forEach(structures, (quantity, structureId) => {
        if(!output[populationId][structureId]) {
          output[populationId][structureId] = 0;
        }

        output[populationId][structureId] += quantity;
      });
    });

    return output;
  }, {});
}
