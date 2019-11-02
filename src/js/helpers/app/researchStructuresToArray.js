
import forEach from '@/helpers/object/forEach';


export default function researchStructuresToArray(structures) {
  const output = [];

  forEach(structures, (populationStructures, populationId) => {
    forEach(populationStructures, (quantity, structureId) => {
      output.push({
        populationId,
        structureId,
        quantity
      });
    });
  });

  return output;
}
