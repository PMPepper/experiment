export default function findLast(arr, searchFunc) {
  for(let i = arr.length - 1; i > -1; --i) {
    if(searchFunc(arr[i])) {
      return arr[i];
    }
  }

  return null;
}
