//will return items in arr1 that are not present in arr2
export default function arrayDifference(arr1, arr2) {
  arr1 = [...new Set(arr1)];//putting into a set removes duplicates
  let set = new Set(arr2);//putting into set allows faster value lookup

  //turn a into an array, then filter to only include stuff that's not in arr2
  return arr1.filter(x => !set.has(x));
}
