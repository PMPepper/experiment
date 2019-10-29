import EntityProcessor from '@/game/server/EntityProcessor';

function researchTest(entity) {
  return false
}

function researchFactory(lastTime, time, init, full) {
  return null;
}


export default () => (new EntityProcessor(researchTest, researchFactory));
