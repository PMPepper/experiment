//get the set of values that are in both arrays

export default function intersection(a, b) {
  var setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
}
