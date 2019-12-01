export default function toString(value, ...options) {
  if(value === null || value === undefined || (typeof(value) === 'string')) {
    return value;
  }

  return value.toString(...options);
}
