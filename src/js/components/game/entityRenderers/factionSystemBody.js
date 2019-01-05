import React from 'react';



export default function factionSystemBody(props) {

  const {entity, entities, zoom} = props;
  const systemBodyEntity = entities[entity.systemBodyId];
  const systemBody = systemBodyEntity.systemBody;

  const baseRadius = zoom * systemBody.radius;

  switch(systemBody.type) {
    case 'star':
      return <circle cx={systemBodyEntity.position.x * zoom} cy={systemBodyEntity.position.y * zoom} r={Math.max(7, baseRadius)} fill="#FDFF00" />
    case 'gasGiant':
      return <circle cx={systemBodyEntity.position.x * zoom} cy={systemBodyEntity.position.y * zoom} r={Math.max(6, baseRadius)} fill="#6666CC" />
    case 'planet':
      return <circle cx={systemBodyEntity.position.x * zoom} cy={systemBodyEntity.position.y * zoom} r={Math.max(5, baseRadius)} fill="#3333FF" />
    case 'moon':
      return <circle cx={systemBodyEntity.position.x * zoom} cy={systemBodyEntity.position.y * zoom} r={Math.max(4, baseRadius)} fill="#4444FF" />
    case 'asteroid':
      return <circle cx={systemBodyEntity.position.x * zoom} cy={systemBodyEntity.position.y * zoom} r={Math.max(2, baseRadius)} fill="#999999" />
    default:
      throw new Error('Unknown system body type: ', );
  }

  return null;
}
