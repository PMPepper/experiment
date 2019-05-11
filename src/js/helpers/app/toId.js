export default function toId(val) {
  if(typeof(val) === 'obj') {
    return val.id
  }

  return val;
}
