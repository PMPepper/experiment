import EntityProcessor from '@/game/server/EntityProcessor';

function constructionTest(entity) {
  return false
}

function constructionFactory(lastTime, time, init, full) {
  return null;
}


export default () => (new EntityProcessor(constructionTest, constructionFactory));
