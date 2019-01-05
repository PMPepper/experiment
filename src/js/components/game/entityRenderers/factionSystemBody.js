import React from 'react';



export default function factionSystemBody(props) {
  const {entity, entities, zoom, styles, x, y} = props;
  const systemBodyEntity = entities[entity.systemBodyId];
  const systemBody = systemBodyEntity.systemBody;

  const baseRadius = zoom * systemBody.radius;
  const bodyProps = {
    cx: (systemBodyEntity.position.x - x) * zoom,
    cy: (systemBodyEntity.position.y - y) * zoom,
    className: `systemBody ${styles[systemBody.type]}`,
    r: Math.max(systemBodyTypeMinRadius[systemBody.type], baseRadius)
  };

  return [
    <circle {...bodyProps} key="body" />,
    <text className={`${styles.systemBodyLabel} ${styles[systemBody.type]}`} x={bodyProps.cx} y={bodyProps.cy + bodyProps.r + 3 + 14} key="text">{entity.factionSystemBody.name}</text>
  ]

  return null;
}

const systemBodyTypeMinRadius = {
  star: 7,
  gasGiant: 6,
  planet: 5,
  moon: 4,
  asteroid: 2,
};
