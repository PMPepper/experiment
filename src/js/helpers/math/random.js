import roundTo from '@/helpers/math/round-to';

export default function random(min, max, decimalPlaces = null, randFunc = Math.random) {
  const range = max - min;

  if(range < 0) {
    throw new Error('Invalid range');
  }

  const baseNumber = min + (range * randFunc());

  if(decimalPlaces === null || decimalPlaces === undefined) {
    return baseNumber;
  }

  //round to decimal places
  return roundTo(baseNumber, decimalPlaces);
}
