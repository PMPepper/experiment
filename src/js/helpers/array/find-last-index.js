export default function findLastIndex(arr, searchFunc) {
  for(let i = arr.length - 1; i > -1; --i) {
    if(searchFunc(arr[i])) {
      return i;
    }
  }

  return -1;
}
