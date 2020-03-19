import toId from './toId';

import toString from '@/helpers/string/to-string';

export default function getFactionSystemBodyFromFactionAndSystemBody(faction, systemBody, factionSystemBodies) {
  const factionId = toId(faction);

  if(!systemBody.factionSystemBodyIds || systemBody.factionSystemBodyIds.length ===0 ) {
    return null;
  }

  const factionSystemBodyId = systemBody.factionSystemBodyIds.find(factionSystemBodyId => toString(factionSystemBodies[factionSystemBodyId].factionId) === toString(factionId));

  return factionSystemBodyId ? factionSystemBodies[factionSystemBodyId] : null;
}
