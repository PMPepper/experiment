import EntityProcessor from '@/game/server/EntityProcessor';

//Helpers
import forEach from '@/helpers/object/forEach';
import map from '@/helpers/object/map';
import getResearchProductionFromStructures from '@/helpers/app/getResearchProductionFromStructures';

function researchTest(entity) {
  return entity.type === 'colony';
}

function researchFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function researchProcessor(colony, entityManager, gameConfig) {
      const faction = entityManager.getEntityById(colony.factionId, 'faction');

      const colonyResearchProduction = colony.colony.capabilityProductionTotals.research;

      if(colonyResearchProduction <= 0 || colony.researchQueueIds.length === 0) {
        return false;//no need to do anything for a colony that does not produce any research, or has none queued
      }

      //Tidy up completed resaeach
      forEach(colony.colony.researchInProgress, (progress, researchId) => {
        if(faction.faction.research[researchId]) {//this research has been completed
          delete colony.colony.researchInProgress[researchId];//remove from list of research in progress
        }
      });

      //map into {[populationId]: {[structureId]: quantity}}
      const availableStructures = map(colony.colony.populationStructuresWithCapability, ({research}) => {
        return {...research};
      })

      colony.colony.assignedResearchStructures = {};

      colony.researchQueueIds.forEach(researchQueueId => {
        const researchQueue = entityManager.getEntityById(researchQueueId, 'researchQueue');

        if(researchQueue.researchQueue.researchIds.length === 0) {
          return;//empty queue
        }

        //perform research!
        //-work out what structures are assigned
        const desiredStructures = researchQueue.researchQueue.structures;
        let assignedStructures = {};

        forEach(desiredStructures, (populationStructures, populationId) => {
          forEach(populationStructures, (quantity, structureTypeId) => {
            //none available of this type
            if(!availableStructures[populationId][structureTypeId]) {
              return;
            }

            //not enough available
            if(availableStructures[populationId][structureTypeId] < quantity) {
              if(!assignedStructures[populationId]) {
                assignedStructures[populationId] = {};
              }

              //take what there is
              assignedStructures[populationId][structureTypeId] = availableStructures[populationId][structureTypeId];
              //and mark as gone
              availableStructures[populationId][structureTypeId] = 0;

              return;
            }

            //otherwise assign them & update available
            if(!assignedStructures[populationId]) {
              assignedStructures[populationId] = {};
            }

            assignedStructures[populationId][structureTypeId] = quantity;
            availableStructures[populationId][structureTypeId] -= quantity;
          });
        });

        //now work out how much research that produces
        const researchProduction = getResearchProductionFromStructures(assignedStructures, colony);

        //update current research project
        const currentResearchProjectId = researchQueue.researchQueue.researchIds[0];
        const currentResearchProject = gameConfig.research[currentResearchProjectId];

        //increment research in progress
        colony.colony.researchInProgress[currentResearchProjectId] = Math.min(currentResearchProject.cost, (colony.colony.researchInProgress[currentResearchProjectId] || 0) + researchProduction)
        colony.colony.assignedResearchStructures[researchQueueId] = assignedStructures
      });

      return true;
    }
  }

  return null;
}

export default () => (new EntityProcessor(researchTest, researchFactory));
