import EntityProcessor from '@/game/server/EntityProcessor';

function updateResearchQueueTest(entity) {
  return entity.type === 'researchQueue';
}

function updateResearchQueueFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function updateResearchQueueProcessor(researchQueue, entityManager, gameConfig) {
      if(researchQueue.researchQueue.researchIds.length === 0) {
        return false;
      }

      const faction = entityManager.getEntityById(researchQueue.factionId, 'faction');

      //filter out completed research projects
      const newResearchIds = researchQueue.researchQueue.researchIds.filter((researchId) => {
        return !faction.faction.research[researchId]
      });

      //If new list is different, switch to new list and report entity as changed
      if(newResearchIds.length !== researchQueue.researchQueue.researchIds.length) {
        researchQueue.researchQueue.researchIds = newResearchIds;

        return true;
      }

      return false;
    }
  }

  return null;
}


export default () => (new EntityProcessor(updateResearchQueueTest, updateResearchQueueFactory));
