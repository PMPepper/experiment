export default {
  fuelTankHuge: {
    name: 'Huge fuel tank',
    componentTypeId: 'fuelTank',

    properties: {
      mass: 5000,
      bp: 200,
      hitpoints: 1,
      crew: 0,
      explosionChance: 0,
      fuelStorage: 5000000
    },
    minerals: {
      "4": 100
    }
  },
  fuelTankVeryLarge: {
    name: 'Very large fuel tank',
    componentTypeId: 'fuelTank',

    properties: {
      mass: 1000,
      bp: 70,
      hitpoints: 1,
      crew: 0,
      explosionChance: 0,
      fuelStorage: 1000000
    },
    minerals: {
      "4": 35
    }
  },
  fuelTankLarge: {
    name: 'Large fuel tank',
    componentTypeId: 'fuelTank',

    properties: {
      mass: 250,
      bp: 30,
      hitpoints: 1,
      crew: 0,
      explosionChance: 0,
      fuelStorage: 250000
    },
    minerals: {
      "4": 15
    }
  },
  fuelTank: {
    name: 'Fuel tank',
    componentTypeId: 'fuelTank',

    properties: {
      mass: 50,
      bp: 10,
      hitpoints: 1,
      crew: 0,
      explosionChance: 0,
      fuelStorage: 50000
    },
    minerals: {
      "4": 5
    }
  },
  fuelTankSmall: {
    name: 'Small Fuel tank',
    componentTypeId: 'fuelTank',

    properties: {
      mass: 10,
      bp: 3,
      hitpoints: 0.2,
      crew: 0,
      explosionChance: 0,
      fuelStorage: 10000
    },
    minerals: {
      "4": 1.5
    }
  },
  fuelTankTiny: {
    name: 'Tiny Fuel tank',
    componentTypeId: 'fuelTank',

    properties: {
      mass: 5,
      bp: 2,
      hitpoints: 0.1,
      crew: 0,
      explosionChance: 0,
      fuelStorage: 5000
    },
    minerals: {
      "4": 1
    }
  }
}
