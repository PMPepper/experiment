import toEntity from './toEntity';

export default function getColoniesBySystemBody(systemBody, entities) {
  return toEntity(systemBody, entities).colonyIds.map(id => (entities[id]));
}
