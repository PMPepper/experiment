//includes stuff that usually won't change between games (minerals, tech tree, structure build times, costs, minerals, etc)

export default {
  baseSpecies: {
    growthRate: 1.05,
    production: 1,
    research: 1,
    mining: 1,
    support: 1,//multiplier on how many individuals are needed for support jobs in a colony (e.g. agriculture, bureaucracy etc)
    staffMultiplier: 1,//how many individuals are needed to operate something, e.g. if a factory needs a base of 1000 workers, and this value is 2, then you'll need 2000 workers to operate the factory
    crewMultiplier: 1,//As above, but for crewing ships
  },
  minerals: {
    "1": "Thatcherite",//coru
    "2": "Blairite",//vend
    "3": "Brownite",//trit
    "4": "Corbynite",//dura
    "5": "Adamantium",//neu
    "6": "Mayite",//corbo
    "7": "Chobium",//galli
    "8": "Sloughium",//boro
    "9": "Muskite",//merc
    "10": "Majorium",
    "11": "Cameronium",//uri
    "12": "Stellarium",//sori
  },
  startingWorldMinerals: {
    "1": {quantity: [400000, 500000], access: [0.7, 1]},
    "2": {quantity: [50000, 100000], access: [0.5, 1]},
    "3": {quantity: [50000, 100000], access: [0.5, 1]},
    "4": {quantity: [50000, 100000], access: [0.5, 1]},
    "5": {quantity: [50000, 100000], access: [0.8, 1]},
    "6": {quantity: [50000, 100000], access: [0.5, 1]},
    "7": {quantity: [50000, 100000], access: [0.5, 1]},
    "8": {quantity: [50000, 100000], access: [0.5, 1]},
    "9": {quantity: [50000, 100000], access: [0.5, 1]},
    "10": {quantity: [50000, 100000], access: [0.5, 1]},
    "11": {quantity: [50000, 100000], access: [0.5, 1]},
    "12": {quantity: [200000, 250000], access: [0.5, 1]},
  },
  systemBodyTypeMineralAbundance: {
    "planet": {
      "1": 1,//coru
      "2": 1,//vend
      "3": 1,//trit
      "4": 1,//dura
      "5": 1,//neu
      "6": 1,//corbo
      "7": 1,//galli
      "8": 1,//boro
      "9": 1,//merc
      "10": 1,
      "11": 1,//uri
      "12": 1,//sori
    },
    "moon": {
      "1": 1,//coru
      "2": 1,//vend
      "3": 1,//trit
      "4": 1,//dura
      "5": 1,//neu
      "6": 1,//corbo
      "7": 1,//galli
      "8": 1,//boro
      "9": 1,//merc
      "10": 1,
      "11": 1,//uri
      "12": 1,//sori
    },
    "dwarfPlanet": {
      "1": 1,//coru
      "2": 1,//vend
      "3": 1,//trit
      "4": 1,//dura
      "5": 1,//neu
      "6": 1,//corbo
      "7": 1,//galli
      "8": 1,//boro
      "9": 1,//merc
      "10": 1,
      "11": 1,//uri
      "12": 1,//sori
    },
    "asteroid": {
      "1": 1,//coru
      "2": 1,//vend
      "3": 1,//trit
      "4": 1,//dura
      "5": 1,//neu
      "6": 1,//corbo
      "7": 1,//galli
      "8": 1,//boro
      "9": 1,//merc
      "10": 1,
      "11": 1,//uri
      "12": 0.2,//sori
    },
    "gasGiant": {
      "1": 0,//coru
      "2": 0,//vend
      "3": 0,//trit
      "4": 0,//dura
      "5": 0,//neu
      "6": 0,//corbo
      "7": 0,//galli
      "8": 0,//boro
      "9": 0,//merc
      "10": 0,
      "11": 0,//uri
      "12": 1,//sori
    },
  },
  structures: {
    "1": {
      name: 'Conventional industry',
      mass: 25e6,
      workers: 50000,
      bp: 100,
      minerals: {},
      properties: {
        construction: 1
      },
      upgrade: [3],
    },
    "2": {
      name: 'Conventional mine',
      mass: 25e6,
      workers: 50000,
      bp: 100,
      minerals: {},
      properties: {
        mining: 1
      },
      upgrade: [4],
    },
    "3": {
      name: 'PE Industry',
      mass: 25e6,
      workers: 50000,
      bp: 120,
      minerals: {
        "4": 60,
        "3": 30,
        "2": 30,
      },
      properties: {
        construction: 10
      }
    },
    "4": {
      name: 'PE mine',
      mass: 25e6,
      workers: 50000,
      bp: 120,
      minerals: {
        "4": 60,
        "1": 30,
      },
      properties: {
        mining: 10
      }
    },
    "5": {
      name: 'Conventional research facility',
      mass: 5e8,
      workers: 1000000,
      bp: 2000,
      minerals: {},
      properties: {
        research: 1
      },
      upgrade: [6],
    },
    "6": {
      name: 'PE research facility',
      mass: 5e8,
      workers: 1000000,
      bp: 2400,
      minerals: {
        "4": 1200,
        "9": 1200,
      },
      properties: {
        research: 10
      }
    },
  },
  researchAreas: {
    "1": "Biology",
    "2": "Industrial",
    "3": "Defensive systems",
    "4": "Energy weapons",
    "5": "Logistics",
    "6": "Ground combat",
    "7": "Missiles and kinetic weapons",
    "8": "Power and propulsion",
    "9": "Sensors and fire control",
  },
  research: {
    "1": {
      name: 'Post-Einstein technology',
      description: "Unlock the potential of Post-Einsteinium (PE) physics to create technology vastly superior to anything previously thought possible.",
      cost: 5000,
      area: 2
    },
    "e1": {
      name: "PE Drive",
      description: "Utilise PE physics to create a fundamentally new form of propulsion and gain access to the far reaches of our solar system",
      cost: 500,
      area: 8
    }
  },
};