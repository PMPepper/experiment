//does array 2 contain all the same values as array 1
export default function arrayContainsAll (arr1, arr2) {
  return arr2.every(arr2Item => arr1.includes(arr2Item));
}
