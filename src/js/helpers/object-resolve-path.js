export default function objectResolvePath(obj, path) {
  path = path
    .replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '');          // strip a leading dot

  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj);
}
