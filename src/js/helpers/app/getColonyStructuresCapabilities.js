
//Helpers
import reduce from '@/helpers/object/reduce';
import forEach from '@/helpers/object/forEach';

//The component
export default function getColonyStructuresCapabilities(colony, capability) {
  return reduce(colony.colony.populationStructuresWithCapability, (output, populationStructuresWithCapability, populationId) => {
    const capabilityStructures = populationStructuresWithCapability[capability]

    capabilityStructures && forEach(capabilityStructures, (quantity, structureId) => {
      output.push({
        populationId,
        structureId,
        quantity
      });
    });

    return output
  }, []);
}
