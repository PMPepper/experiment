import resolveObjPath from '@/helpers/object/resolve-path';


export default function sortAlphabeticalOnObjPath(path, locales = undefined, desc = false) {
  let collator = (locales instanceof Intl.Collator) ? locales : new Intl.Collator(locales, {numeric: true, sensitivity: 'base'});

  return desc ? (a, b) => {
    return collator.compare(resolveObjPath(b, path), resolveObjPath(a, path));
  }
  :
  (a, b) => {
    return collator.compare(resolveObjPath(a, path), resolveObjPath(b, path));
  }
}
