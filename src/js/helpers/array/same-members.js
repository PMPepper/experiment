import arrayContainsAll from './contains-all';

//Does these two arrays contain all the same data (non-order specific)
export default function arraySameMembers (arr1, arr2) {
  return arrayContainsAll(arr1, arr2) && arrayContainsAll(arr2, arr1);
}
