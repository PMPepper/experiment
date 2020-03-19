//object - object to filter,
//filterFunc - callback function, retrusn boolean to decide if this key/value should be in the returned object
//props - optional additional props to be passed to the filterFunc

export default function objectFilter(object, filterFunc) {
  const keys = Object.keys(object);
  const output = {};

  for(let i = 0, l = keys.length; i < l; ++i) {
    const key = keys[i];
    const value = object[key];

    if(filterFunc(value, key, object)) {
      output[key] = value;
    }
  }

  return output;
}
