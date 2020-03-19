export default function arrayRemove(arr, ...items) {
  const filtered = arr.filter(value => {
    return !items.includes(value)
  });

  if(filtered.length === arr.length) {
    return arr;
  }

  return filtered;
}
