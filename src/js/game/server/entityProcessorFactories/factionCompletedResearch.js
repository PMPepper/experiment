import EntityProcessor from '@/game/server/EntityProcessor';

//Helpers
import forEach from '@/helpers/object/forEach';

function factionCompletedResearchTest(entity) {
  return entity.type === 'faction';
}

function factionCompletedResearchFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function factionCompletedResearchProcessor(faction, entities, gameConfig) {
      faction.colonyIds.forEach(colonyId => {
        const colony = entities[colonyId];

        forEach(colony.colony.researchInProgress, (researchProgress, researchId) => {
          const research = gameConfig.research[researchId];

          if(researchProgress >= research.cost) {
            //research completed
            faction.faction.research[researchId] = true;

            //unlock technology
            research.unlockTechnologyIds.forEach(technologyId => {
              faction.faction.technology[technologyId] = true;
            });
          }

          if(faction.faction.research[researchId]) {//this research has been completed
            delete colony.colony.researchInProgress[researchId];//remove from list of research in progress
          }
        });
      })

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(factionCompletedResearchTest, factionCompletedResearchFactory));
