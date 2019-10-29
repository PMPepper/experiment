import EntityProcessor from '@/game/server/EntityProcessor';

function shipBuildingTest(entity) {
  return false
}

function shipBuildingFactory(lastTime, time, init, full) {
  return null;
}


export default () => (new EntityProcessor(shipBuildingTest, shipBuildingFactory));
