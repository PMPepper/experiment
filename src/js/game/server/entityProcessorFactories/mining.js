import EntityProcessor from '@/game/server/EntityProcessor';

function miningTest(entity) {
  return false
}

function miningFactory(lastTime, time, init, full) {
  return null;
}


export default () => (new EntityProcessor(miningTest, miningFactory));
