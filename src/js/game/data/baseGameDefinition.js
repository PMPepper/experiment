import systems from './systems';

const worldDefinition = {
  type: 'new',
  gameName: 'flobble',
  startDate: '2000-01-01T00:00:00Z',
  systems: systems,
  species: {
    Humans: {name: 'Humans', growthRate: 1.05, miningRate: 1, researchRate: 1, constructionRate: 1},
    Martians: {name: 'Martians', growthRate: 1.04, miningRate: 0.9, researchRate: 1.1, constructionRate: 1},
  },
  factions: [{
    name: 'Humans',
    startingResearch: ['pe', 'e1', 'armour1', 'fuelTank', 'fuelTankSmall'],
    //key value pair, where key is 'id' for generation reference (shared between factions) and value is the system,
    //currently only known systems supported
    startingSystems: {
      Sol: {
        type: 'known',
      },
      // Sol2: {
      //   type: 'known',
      //   name: 'Bumhole'
      // },
      // Sol3: {
      //   type: 'known',
      //   name: 'AAAA'
      // },
      // Sol4: {
      //   type: 'known',
      //   name: 'Wibble'
      // }
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
          structures: {
            "1": 150,
            "2": 100,
            "5": 0
          }
        },
        {
          species: 'Martians',
          population: 500000000,
          structures: {
            "1": 50,
            "2": 0,
            "5": 10
          }
        }
      ],
      shipyards: [
        {
          species: 'Humans',
          military: true,
          slipways: 2,
          capacity: 5000
        },
        {
          species: 'Humans',
          military: true,
          slipways: 1,
          capacity: 10000
        },
        {
          species: 'Humans',
          military: false,
          slipways: 1,
          capacity: 30000
        },
        {
          species: 'Martians',
          military: false,
          slipways: 2,
          capacity: 15000
        }
      ]
      //TODO
      //money, minerals, fuel, etc
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
          structures: {
            "1": 20,
            "2": 5,
            "5": 0
          },
        }
      ],


      //TODO
      //money, minerals, fuel, etc
    },
    // {
    //   isStartingWorld: true,
    //   isSurveyed: true,
    //   system: 'Sol2',//ID from systemsSystems object (the key)
    //   body: 'Mars',//body ID (what if random?)
    //   populations: [
    //     {
    //       species: 'Humans',
    //       population: 50000000,
    //       structures: {
    //         "1": 125,
    //         "2": 45,
    //         "5": 3
    //       },
    //     }
    //   ],
    //   //TODO
    //   //money, minerals, fuel, etc
    // },
    // {
    //   isStartingWorld: true,
    //   isSurveyed: true,
    //   system: 'Sol3',//ID from systemsSystems object (the key)
    //   body: 'Luna',//body ID (what if random?)
    //   populations: [
    //     {
    //       species: 'Humans',
    //       population: 20000000,
    //       structures: {
    //         "1": 102,
    //         "2": 40,
    //         "5": 2
    //       },
    //     }
    //   ],
    //   //TODO
    //   //money, minerals, fuel, etc
    // }
    ]
  },
  // {
  //   name: 'Martians',
  //   startingResearch: [],
  //   //key value pair, where key is 'id' for generation reference (shared between factions) and value is the system,
  //   //currently only known systems supported
  //   startingSystems: {
  //     Sol: {
  //       type: 'known',
  //       name: 'Crazytown',
  //       bodyNamesMap: {
  //         Earth: 'Bumhole 1',
  //         Mars: 'Coolville'
  //       }
  //     }
  //   },
  //   startingColonies: [{
  //     isStartingWorld: true,
  //     isSurveyed: true,
  //     system: 'Sol',//ID from systemsSystems object (the key)
  //     body: 'Mars',//body ID (what if random?)
  //     populations: [
  //       {
  //         species: 'Humans',
  //         population: 1000000000,
  //         structures: {
  //           "1": 225,
  //           "2": 175,
  //           "5": 13
  //         },
  //       }
  //     ],
  //
  //     //TODO
  //     //money, minerals, fuel, etc
  //   }]
  // }
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
