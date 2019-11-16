import * as RenderFlags from '../renderFlags';
import {circle, text, position} from '../SystemMap';
import {
  outOfBoundsVCull, outOfBoundsHCull, startFadeRadius, fullyFadeRadius,
  startFadeOrbitRadius, fullyFadeOrbitRadius, startFadeLargeOrbit,
  fullyFadeLargeOrbit, shipyardMinRadius
} from '../GameConsts';




export default function factionSystemBodyRenderer(renderPrimitives, entityScreenPositions, windowSize, x, y, zoom, entity, entities, colonies, options) {
  const id = entity.id;
  const parent = entity.movement && entity.movement.orbitingId && entities[entity.movement.orbitingId];
  const displayOptions = options.bodies.shipyard;

  const radius = entity.shipyard.radius;

  const baseRadius = zoom * radius;
  const cx = (entity.position.x - x) * zoom;
  const cy = (entity.position.y - y) * zoom;
  const r = Math.max(shipyardMinRadius, baseRadius);
  let opacity = 1;

  let orbitOpacity = 1;

  //TODO Which parts should be rendered?
  let displayBody = (displayOptions.body & RenderFlags.ALL)
  let displayLabel = (displayOptions.label & RenderFlags.ALL)
  let displayOrbit = parent && (displayOptions.orbit & RenderFlags.ALL);


  //is visible on the screen?
  if(
    cx < -outOfBoundsVCull
    || cy < -outOfBoundsHCull
    || cx > windowSize.width + outOfBoundsVCull
    || cy > windowSize.height + outOfBoundsHCull
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
    opacity = (baseRadius - fullyFadeRadius) / (startFadeRadius - fullyFadeRadius);
  }

  //Is the orbit of this entity too small to render?
  let orbitRadius;
  let orbitX;
  let orbitY;

  orbitRadius = entity.movement.radius * zoom;
  orbitX = (parent.position.x - x) * zoom;
  orbitY = (parent.position.y - y) * zoom;

  if(orbitRadius < fullyFadeOrbitRadius) {
    //orbital radius too small, do not render this system body
    displayBody = false;
    displayLabel = false;
    displayOrbit = false;
  } else if(orbitRadius < startFadeOrbitRadius) {
    opacity = Math.min(opacity, (orbitRadius - fullyFadeOrbitRadius) / (startFadeOrbitRadius - fullyFadeOrbitRadius));
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

  //Output primitives
  if(displayOrbit) {
    renderPrimitives.push(circle(`${id}-orbit`, orbitX, orbitY, orbitRadius, Math.min(orbitOpacity, opacity), 'orbit', 'shipyard'));
  }

  if(displayBody) {
    renderPrimitives.push(circle(`${id}-body`, cx, cy, r, opacity, 'shipyard', 'shipyard'));
  }

  if(displayLabel) {//TODO shipyard names
    renderPrimitives.push(text(`${id}-label`, 'Shipyard', cx, cy + r + 4, opacity, 'shipyardLabel', null));
  }

  //record position
  entityScreenPositions.push(position(id, cx, cy, displayBody ? r : 0));
}
