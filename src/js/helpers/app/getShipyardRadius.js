import getShipyardMass from '@/helpers/app/getShipyardMass';
import radiusOfSphereFromMassAndDensity from '@/helpers/math/radius-of-sphere-from-mass-and-density';

//Consts
const shipyardDensity = 0.05;//TODO this is temporary, make this configurable? or something?


//The helper function
export default function getShipyardRadius(isMilitary, capacity, slipways, gameConfig) {
  const mass = getShipyardMass(isMilitary, capacity, slipways, gameConfig);

  return radiusOfSphereFromMassAndDensity(mass, shipyardDensity);
}
