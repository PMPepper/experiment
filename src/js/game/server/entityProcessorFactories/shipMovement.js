import EntityProcessor from '@/game/server/EntityProcessor';

function shipMovementTest(entity) {
  return false
}

function shipMovementFactory(lastTime, time, init, full) {
  return null;
}


export default () => (new EntityProcessor(shipMovementTest, shipMovementFactory));
