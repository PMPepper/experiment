import React from 'react';

import * as RenderFlags from '../renderFlags';


//The component
export default function factionSystemBody(props) {
  const {entity, entities, colonies, zoom, styles, x, y, windowSize, options} = props;
  const systemBodyEntity = entities[entity.systemBodyId];
  const systemBody = systemBodyEntity.systemBody;
  const systemBodyDisplayOptions = options.bodies[systemBody.type];

  const parent = systemBodyEntity.movement && systemBodyEntity.movement.orbitingId && entities[systemBodyEntity.movement.orbitingId];

  const hasMinerals = false;
  const hasColony = !!colonies[systemBodyEntity.id];

  const baseRadius = zoom * systemBody.radius;
  const bodyProps = {
    cx: (systemBodyEntity.position.x - x) * zoom,
    cy: (systemBodyEntity.position.y - y) * zoom,
    className: `systemBody ${styles[systemBody.type]}`,
    r: Math.max(systemBodyTypeMinRadius[systemBody.type], baseRadius),
    opacity: 1
  };
  let orbitOpacity = 1;

  //Which parts should be rendered?
  let displayBody = (systemBodyDisplayOptions.body & RenderFlags.ALL) || (hasColony && systemBodyDisplayOptions.body & RenderFlags.COLONY) || (hasMinerals && systemBodyDisplayOptions.body & RenderFlags.MINERALS)
  let displayLabel = (systemBodyDisplayOptions.label & RenderFlags.ALL) || (hasColony && systemBodyDisplayOptions.label & RenderFlags.COLONY) || (hasMinerals && systemBodyDisplayOptions.label & RenderFlags.MINERALS)
  let displayOrbit = parent && (systemBodyDisplayOptions.orbit & RenderFlags.ALL) || (hasColony && systemBodyDisplayOptions.orbit & RenderFlags.COLONY) || (hasMinerals && systemBodyDisplayOptions.orbit & RenderFlags.MINERALS)

  //is visible on the screen?
  if(
    bodyProps.cx < -outOfBoundsVCull
    || bodyProps.cy < -outOfBoundsHCull
    || bodyProps.cx > windowSize.width + outOfBoundsVCull
    || bodyProps.cy > windowSize.height + outOfBoundsHCull
  ) {
    displayBody = false;//culled as out of bounds
    displayLabel = false;
  }

  //is too small to render
  if(baseRadius < fullyFadeRadius) {
    displayBody = false;//culled as out of bounds
    displayLabel = false;
    displayOrbit = false;
  } else if(baseRadius < startFadeRadius) {
    bodyProps.opacity = (baseRadius - fullyFadeRadius) / (startFadeRadius - fullyFadeRadius);
  }

  //Is the orbit of this entity too small to render?
  let orbitRadius;
  let orbitX;
  let orbitY;

  if(parent) {
    orbitRadius = systemBodyEntity.movement.radius * zoom;
    orbitX = (parent.position.x - x) * zoom;
    orbitY = (parent.position.y - y) * zoom;

    if(orbitRadius < fullyFadeOrbitRadius) {
      //orbital radius too small, do not render this system body
      displayBody = false;
      displayLabel = false;
      displayOrbit = false;
    } else if(orbitRadius < startFadeOrbitRadius) {
      bodyProps.opacity = Math.min(bodyProps.opacity, (orbitRadius - fullyFadeOrbitRadius) / (startFadeOrbitRadius - fullyFadeOrbitRadius));
    } else if(orbitRadius > fullyFadeLargeOrbit) {
      //hide really large orbits because rendering them causes issues in Chrome and Edge
      displayOrbit = false;
    } else if(orbitRadius > startFadeLargeOrbit) {
      orbitOpacity = 1 - ((orbitRadius - startFadeLargeOrbit) / (fullyFadeLargeOrbit - startFadeLargeOrbit));
    }

    if(displayOrbit) {
      //check if orbit is culled as out of bounds (add 1 pixel padding)
      if(
        orbitX < -orbitRadius - 1
        || orbitY < -orbitRadius - 1
        || orbitX > windowSize.width + orbitRadius + 1
        || orbitY > windowSize.height + orbitRadius + 1
      ) {
        //culled as out of bounds
        displayOrbit = false;
      }
    }
  }

  return [
    displayOrbit && <circle
      className={`${styles.orbit} ${styles[systemBody.type]}`}
      cx={orbitX}
      cy={orbitY}
      r={orbitRadius}
      opacity={Math.min(orbitOpacity, bodyProps.opacity)}
      key="orbit"
    />,
    displayBody && <circle
      {...bodyProps}
      key="body"
      data-entity-id={entity.systemBodyId}
    />,
    displayBody && hasColony && options.highlightColonies && <circle
      className={`${styles.colonyHighlight} ${styles[systemBody.type]}`}
      cx={bodyProps.cx}
      cy={bodyProps.cy}
      r={bodyProps.r + 3}
      key="colony"
      data-entity-id={entity.systemBodyId}
    />,
    displayLabel && <text
      className={`${styles.systemBodyLabel} ${styles[systemBody.type]}`}
      x={bodyProps.cx}
      y={bodyProps.cy + bodyProps.r + 3 + 14}
      fillOpacity={bodyProps.opacity}
      key="text"
    >
      {entity.factionSystemBody.name}
    </text>,
  ]

  return null;
}

//consts
const systemBodyTypeMinRadius = {
  star: 7,
  gasGiant: 6,
  planet: 5,
  dwarfPlanet: 4,
  moon: 4,
  asteroid: 2,
};

const outOfBoundsVCull = 75;
const outOfBoundsHCull = 25;

const startFadeRadius = 0.0002;
const fullyFadeRadius = 0.00005;

const startFadeOrbitRadius = 10;
const fullyFadeOrbitRadius = 5;

const startFadeLargeOrbit = 12500;
const fullyFadeLargeOrbit = 25000;
