import systems from './systems';

const worldDefinition = {
  type: 'new',
  gameName: 'flobble',
  startDate: '2000-01-01T00:00:00',
  systems: systems,
  species: {
    Humans: {name: 'Humans', growthRate: 1.05}
  },
  factions: [{
    name: 'Humans',
    //key value pair, where key is 'id' for generation reference (shared between factions) and value is the system,
    //currently only known systems supported
    startingSystems: {
      Sol: {
        type: 'known',
      },
      Sol2: {
        type: 'known',
        name: 'Bumhole'
      },
      Sol3: {
        type: 'known',
        name: 'AAAA'
      },
      Sol4: {
        type: 'known',
        name: 'Wibble'
      }
    },
    startingColonies: [{
      isStartingWorld: true,
      isSurveyed: true,
      system: 'Sol',//ID from systemsSystems object (the key)
      body: 'Earth',//body ID (what if random?)
      populations: [
        {
          species: 'Humans',
          population: 1000000000,
        }
      ]

      //TODO
      //money, structures, minerals, fuel, technology, etc
    },
    {
      isStartingWorld: true,
      isSurveyed: true,
      system: 'Sol',//ID from systemsSystems object (the key)
      body: 'Luna',//body ID (what if random?)
      populations: [
        {
          species: 'Humans',
          population: 10000000,
        }
      ]

      //TODO
      //money, structures, minerals, fuel, technology, etc
    },
    {
      isStartingWorld: true,
      isSurveyed: true,
      system: 'Sol2',//ID from systemsSystems object (the key)
      body: 'Mars',//body ID (what if random?)
      populations: [
        {
          species: 'Humans',
          population: 50000000,
        }
      ]

      //TODO
      //money, structures, minerals, fuel, technology, etc
    },
    {
      isStartingWorld: true,
      isSurveyed: true,
      system: 'Sol3',//ID from systemsSystems object (the key)
      body: 'Luna',//body ID (what if random?)
      populations: [
        {
          species: 'Humans',
          population: 20000000,
        }
      ]

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
      isStartingWorld: true,
      isSurveyed: true,
      system: 'Sol',//ID from systemsSystems object (the key)
      body: 'Mars',//body ID (what if random?)
      populations: [
        {
          species: 'Humans',
          population: 1000000000,
        }
      ]
      //TODO
      //money, structures, minerals, fuel, technology, etc
    }]
  }],

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
