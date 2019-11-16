


export default function radiusOfSphereFromMassAndDensity(mass, density) {
  return Math.pow((3 * mass) / (4 * density * Math.PI), 1/3);
}
