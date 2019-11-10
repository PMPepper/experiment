//import resolveObjPath from '@/helpers/object/resolve-path';


export default function sortAlphabeticalOnMappedProp(mapFunc, locales = undefined, desc = false) {
  let collator = (locales instanceof Intl.Collator) ? locales : new Intl.Collator(locales, {numeric: true, sensitivity: 'base'});

  return desc ? (a, b) => {
    return collator.compare(mapFunc(b), mapFunc(a));
  }
  :
  (a, b) => {
    return collator.compare(mapFunc(a), mapFunc(b));
  }
}
