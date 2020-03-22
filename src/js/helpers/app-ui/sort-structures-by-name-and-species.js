//Helpers
import sortAlphabeticalOnMappedProp from '@/helpers/sorting/sort-alphabetical-on-mapped-prop';
import makeCombinedSortFunc from '@/helpers/sorting/make-combined-sort-func';


//The helper func
export default function sortStructuresByNameAndSpecies(langCode, populations, species, structures) {
  //Table sorting
  const sortStructureNameComparator = sortAlphabeticalOnMappedProp(({populationId, structureId}) => {
    return structures[structureId].name
  }, langCode);

  const sortSpeciesNameComparator = sortAlphabeticalOnMappedProp(({populationId, structureId}) => {
    return species[populations[populationId].speciesId].species.name;
  }, langCode);

  const sortComparator = makeCombinedSortFunc(sortStructureNameComparator, sortSpeciesNameComparator);
}
