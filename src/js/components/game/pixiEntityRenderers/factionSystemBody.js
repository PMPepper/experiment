import * as PIXI from 'pixi.js'

import * as RenderFlags from '../renderFlags';
import {
  outOfBoundsVCull, outOfBoundsHCull, startFadeRadius, fullyFadeRadius,
  startFadeOrbitRadius, fullyFadeOrbitRadius, startFadeLargeOrbit,
  fullyFadeLargeOrbit, systemBodyTypeMinRadius
} from '../GameConsts';


export default function factionSystemBodyRenderer(renderProps, windowSize, x, y, zoom, entity, entities, colonies, options, styles) {
  const {graphics, app: {stage}, children, usedChildren} = renderProps;

  //////////////////////////////////////////////////////////////////////////////
  //TODO make this code generic - move into systemMap?
  const systemBodyEntity = entities[entity.systemBodyId];
  const systemBody = systemBodyEntity.systemBody;
  const systemBodyDisplayOptions = options.bodies[systemBody.type];
  const style = styles[systemBody.type];

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
   //End of should be moved into systemMap...?
   /////////////////////////////////////////////////////////////////////////////

   if(displayOrbit) {
     drawCircle(graphics, orbitX, orbitY, orbitRadius, style.orbit, Math.min(orbitOpacity, bodyProps.opacity));
   }

   if(displayBody) {
     drawCircle(graphics, bodyProps.cx, bodyProps.cy, bodyProps.r, style.body, bodyProps.opacity);
   }

   if(displayBody && hasColony && options.highlightColonies) {
     drawCircle(graphics, bodyProps.cx, bodyProps.cy, bodyProps.r + 3, style.highlight, bodyProps.opacity);
   }

   if(displayLabel) {
     //get or create label entity
     const labelName = `${entity.id}_label`;
     let text = children[labelName];

     if(!text) {
       text = children[labelName] = new PIXI.Text(entity.factionSystemBody.name, style.label);
       text.resolution = 4;
       text.anchor.set(0.5, 0);

       stage.addChild(text);
     }

     //record that this entity is in use
     usedChildren[labelName] = text;

     //position text
     text.position.x = bodyProps.cx;
     text.position.y = bodyProps.cy +  + bodyProps.r + 3;
     text.alpha = bodyProps.opacity;
   }
}


function drawCircle(graphics, x, y, r, style, opacity = 1) {
  if(style.strokeWidth) {
    graphics.lineStyle(style.strokeWidth, style.stroke[0], opacity * style.strokeOpacity);
  } else {
    graphics.lineStyle(0);
  }

  if(style.fill) {
    //debugger;
    graphics.beginFill(style.fill[0], style.fill[1] * opacity);
  }

  graphics.drawCircle(x, y, r);

  if(style.fill) {
    graphics.endFill();
  }
}
