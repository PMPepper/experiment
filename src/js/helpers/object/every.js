


export default function every(object, testFunc) {
  for(let i = 0, keys = Object.keys(object), l = keys.length; i < l; i++) {
    const key = keys[i];
    const value = object[key];

    if(!testFunc(value, key)) {
      return false;
    }
  }

  return true;
}
