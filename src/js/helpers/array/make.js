export default function make(length, value) {
  const arr = new Array(length);

  for(let i = 0; i < length; i++) {
    arr[i] = value;
  }

  return arr;
}
