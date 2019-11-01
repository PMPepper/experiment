import EntityProcessor from '@/game/server/EntityProcessor';

//Helpers
import forEach from '@/helpers/object/forEach';
import getResearchProductionFromStructures from '@/helpers/app/getResearchProductionFromStructures';

import {DAY_ANNUAL_FRACTION} from '@/game/Consts';

function researchTest(entity) {
  return entity.type === 'colony';
}

function researchFactory(lastTime, time, init, full) {
  const lastDay = Math.floor(lastTime / 86400);
  const today = Math.floor(time / 86400);

  //only update once a day
  if(lastDay !== today || init) {
    return function researchProcessor(colony, entities, gameConfig) {
      const faction = entities[colony.factionId];

      const colonyResearchProduction = colony.colony.capabilityProductionTotals.research;

      if(colonyResearchProduction <= 0 || colony.researchQueueIds.length === 0 || colony.researchQueueIds.every(researchQueueId => (entities[researchQueueId].researchQueue.researchIds.length === 0))) {
        return false;//no need to do anything for a colony that does not produce any research, or has none queued
      }

      //colony.colony.researchInProgress
      const availableStructures = {...colony.colony.structuresWithCapability.research};

      colony.researchQueueIds.forEach(researchQueueId => {
        const researchQueue = entities[researchQueueId];

        if(researchQueue.researchQueue.researchIds.length === 0) {
          return;//empty queue
        }

        //perform research!
        //-work out what structures are assigned
        const desiredStructures = researchQueue.researchQueue.structures;
        let assignedStructures = {};

        forEach(desiredStructures, (quantity, structureTypeId) => {
          //none available of this type
          if(!availableStructures[structureTypeId]) {
            return;
          }

          //not enough available
          if(availableStructures[structureTypeId] < quantity) {
            //take what there is
            assignedStructures[structureTypeId] = availableStructures[structureTypeId];
            //and mark as gone
            availableStructures[structureTypeId] = 0;

            return;
          }

            //otherwise assign them & update available
            assignedStructures[structureTypeId] = quantity;
            availableStructures[structureTypeId] -= quantity;
        });

        //now work out how much reserach that produces
        const researchProduction = getResearchProductionFromStructures(assignedStructures, gameConfig, faction) * DAY_ANNUAL_FRACTION;

        //update current research project
        const currentResearchProjectId = researchQueue.researchQueue.researchIds[0];
        const currentResearchProject = gameConfig.research[currentResearchProjectId];

        //increment research in progress
        colony.colony.researchInProgress[currentResearchProjectId] = Math.min(currentResearchProject.cost, (colony.colony.researchInProgress[currentResearchProjectId] || 0) + researchProduction)
      });

      return true;
    }
  }

  return null;
}


export default () => (new EntityProcessor(researchTest, researchFactory));
