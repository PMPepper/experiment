import getColoniesBySystemBody from '@/helpers/app/getColoniesBySystemBody';
//import toEntity from '@/helpers/app/toEntity';

export default function(systemBody, entities) {
  return getColoniesBySystemBody(systemBody, entities).reduce(
    (total, colony) => {
      return total + colony.colony.capabilityProductionTotals.mining
    },
    0
  );
}
