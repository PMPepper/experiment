export default function shallowCompare (obj1, obj2) {
  if(!obj1 || !obj2) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  return (keys1.length === keys2.length) && keys1.every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
}
