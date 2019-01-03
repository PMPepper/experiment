import React from 'react';



export default function factionSystemBody(props) {
  const {entity, server, zoom} = props;
  const systemBodyEntity = server.getEntityById(entity.systemBodyId);
  const systemBody = systemBodyEntity.systemBody;

  const baseRadius = zoom * systemBody.radius;

  switch(systemBody.type) {
    case 'star':
      return <circle cx={0} cy={0} r={Math.max(7, baseRadius)} fill="#FFFDFF00" />
    case 'gasGiant':
      return <circle cx={0} cy={0} r={Math.max(6, baseRadius)} fill="#FF6666CC" />
    case 'planet':
      return <circle cx={0} cy={0} r={Math.max(5, baseRadius)} fill="#FF3333FF" />
    case 'moon':
      return <circle cx={0} cy={0} r={Math.max(4, baseRadius)} fill="#FF4444FF" />
    case 'asteroid':
      return <circle cx={0} cy={0} r={Math.max(2, baseRadius)} fill="#FF999999" />
    default:
      throw new Error('Unknown system body type: ', );
  }

  return null;
}
