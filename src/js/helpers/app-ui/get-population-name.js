


export default function getPopulationName(populationId, entities) {
  return entities[entities[populationId].speciesId].species.name;
}
