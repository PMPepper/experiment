


export default function getPopulationName(populationId, populations, species) {
  return species[populations[populationId].speciesId].species.name;
}
