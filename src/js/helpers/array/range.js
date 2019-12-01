//Doesn't deal with negative ranges, etc

export default function arrayRange(start, end) {
  const length = end - start;
  const arr = new Array(length);

  for(let i = 0; i < length; ++i) {
    arr[i] = start + i;
  }

  return arr;
}
