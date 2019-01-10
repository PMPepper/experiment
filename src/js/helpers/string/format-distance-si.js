import roundTo from '@/helpers/math/round-to';
import formatNumber from '@/helpers/string/format-number';

const magnitudes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];


export default function formatDistanceSI(distance, baseMag = 0, maxDP = 0, culture = null, options = null) {
  const pow = Math.floor(Math.log10(distance));
  const mag = Math.floor(pow / 3) - baseMag;

  let magDist = distance / Math.pow(10, mag*3);

  return formatNumber(roundTo(magDist, maxDP), culture, options) + ' ' + magnitudes[mag] + (baseMag > 0 ? ' ' : '') + magnitudes[baseMag] + 'm';
}
