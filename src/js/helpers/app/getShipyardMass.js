

export default function getShipyardMass(isMilitary, capacity, slipways, gameConfig) {
  return capacity * 50 * slipways;//TODO controlled by gameConfig?
}
