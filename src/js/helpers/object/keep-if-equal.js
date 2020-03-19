import shallowCompare from '@/helpers/object/shallow-compare';


export default function keepIfEqual(current, altered) {
  return shallowCompare(current, altered) ?
    current
    :
    altered;
}
