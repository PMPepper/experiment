import * as FactionPlayerTypes from '../FactionPlayerTypes';
import systems from './systems';

const worldDefinition = {
  type: 'new',
  gameName: 'flobble',
  startDate: '2000-01-01T00:00:00',
  systems: systems,
  factions: [{
    name: 'Humans',
    //key value pair, where key is 'id' for generation reference (shared between factions) and value is the system,
    //currently only known systems supported
    startingSystems: {
      Sol: {
        type: 'known',
      }
    },
    startingColonies: [{
      system: 'Sol',//ID from systemsSystems object (the key)
      body: 'Earth',//body ID (what if random?)
      population: 10000000000,
      //TODO
      //money, structures, minerals, fuel, technology, etc
    }]
  },
  {
    name: 'Martians',
    //key value pair, where key is 'id' for generation reference (shared between factions) and value is the system,
    //currently only known systems supported
    startingSystems: {
      Sol: {
        type: 'known',
        name: 'Crazytown',
        bodyNamesMap: {
          Earth: 'Bumhole 1',
          Mars: 'Coolville'
        }
      }
    },
    startingColonies: [{
      system: 'Sol',//ID from systemsSystems object (the key)
      body: 'Mars',//body ID (what if random?)
      population: 10000000000,
      //TODO
      //money, structures, minerals, fuel, technology, etc
    }]
  }],


  players: [
    {
      name: 'Billy',
      factions: [
        {
          name: 'Humans',
          role: FactionPlayerTypes.OWNER
        },
        {
          name: 'Martians',
          role: FactionPlayerTypes.OWNER
        }
      ]
    },
    /*{
      name: 'Willy',
      factions: [
        {
          name: 'Martians',
          role: FactionPlayerTypes.OWNER
        }
      ]
    },
    {
      name: 'Dilly',
      factions: [
        {
          name: 'Martians',
          role: FactionPlayerTypes.OWNER
        }
      ]
    }*/
  ],

  //TODO
  //To be implemented
  //system generation properties
  numSystems: 10,
  wrecks: 0.1,
  ruins: 0.02,

  //threats
  swarmers: 0.1,
  invaders: 0.1,//probably will be more fine-tuned
  sentinels: 0.1,

};

export default worldDefinition;
