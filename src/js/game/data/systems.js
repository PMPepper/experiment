import solAsteroids from './solAsteroids.json';

//const solAsteroids = [];

/*
example random asteroid belt:
{
  "type": "asteroidBelt",
  "parent": "Sol A",
  "nameProps": {
    "prefix": "sol"
  },
  "factionNameProps": {
    "martian": {
      "prefix": "ass"
    },
    "human": {
      "system": "sol"
    }
  },
  "minOrbitRadius": 329115316200,
  "maxOrbitRadius": 478713187200,
  "minNumber": 100,
  "maxNumber": 120,
  "minRadius": 100000,
  "maxRadius": 475000,
  "cTypeWeight": 75,
  "sTypeWeight": 17,
  "mTypeWeight": 8
},
*/

const systems = {
  Sol: {
    "name":"Sol",
    "bodies":[
      {
        "name":"Sol A",
        "type": "star",
        "mass": 1.9891e30,
        "radius": 695700000,
        "day": 2160000,
        "axialTilt": 0.1309,
        "tidalLock": false,
        "luminosity": 3.846e26
      },
      {
        "name": "Mercury",
        "type": "planet",
        "parent": "Sol A",
        "mass": 3.285e23,
        "radius": 2440000,
        "day": 5067000,
        "axialTilt": 0.03682645,
        "tidalLock": true,
        "albedo": 0.068,
        "orbit": {
          "type": "regular",
          "radius": 57909050000,
          "offset": 0.15
        }
      },
      {
        "name": "Venus",
        "type": "planet",
        "parent": "Sol A",
        "mass": 4.8675e24,
        "radius": 6051000,
        "day": 10097200,
        "axialTilt": 3.0944688,
        "tidalLock": false,
        "albedo": 0.77,
        "orbit": {
          "type": "regular",
          "radius": 108208000000,
          "offset": 0.52
        }
      },
      {
        "name": "Earth",
        "type": "planet",
        "parent": "Sol A",
        "mass": 5.972e24,
        "radius": 6371000,
        "day": 86400,
        "axialTilt": 0.408407,
        "tidalLock": false,
        "albedo": 0.29,
        "orbit": {
          "type": "regular",
          "radius": 149600000000,
          "offset": 0
        }
      },
      {
        "name": "Luna",
        "type": "moon",
        "parent": "Earth",
        "mass": 7.34767309e22,
        "radius": 1737000,
        "day": 2548800,
        "axialTilt": 0.0269199584,
        "tidalLock": true,
        "albedo": 0.12,
        "orbit": {
          "type": "regular",
          "radius": 384399000,
          "offset": 0
        }
      },
      {
        "name": "Mars",
        "type": "planet",
        "parent": "Sol A",
        "mass": 6.4171e23,
        "radius": 3389000,
        "day": 88800,
        "axialTilt": 0.436332,
        "tidalLock": false,
        "albedo": 0.25,
        "orbit": {
          "type": "regular",
          "radius": 227939200000,
          "offset": 0.23
        }
      },
      {
        "name": "Phobos",
        "type": "moon",
        "parent": "Mars",
        "mass": 1.0659e16,
        "radius": 11267,
        "day": 88646.4,
        "axialTilt": 0,
        "tidalLock": true,
        "albedo": 0.071,
        "orbit": {
          "type": "regular",
          "radius": 9376000,
          "offset": 0
        }
      },
      {
        "name": "Deimos",
        "type": "moon",
        "parent": "Mars",
        "mass": 1.4762e15,
        "radius": 6200,
        "day": 88646.4,
        "axialTilt": 0,
        "tidalLock": true,
        "albedo": 0.068,
        "orbit": {
          "type": "regular",
          "radius": 23463200,
          "offset": 0
        }
      },
      ...solAsteroids,
      {
        "name": "Jupiter",
        "type": "gasGiant",
        "parent": "Sol A",
        "mass": 1.8986e27,
        "radius": 71492000,
        "day": 35760,
        "axialTilt": 0.05462881,
        "tidalLock": false,
        "albedo": 0.343,
        "orbit": {
          "type": "regular",
          "radius": 778299000000,
          "offset": 0.74
        }
      },
      {
        "name": "Saturn",
        "type": "gasGiant",
        "parent": "Sol A",
        "mass": 5.6836e26,
        "radius": 58232000,
        "day": 38520,
        "axialTilt": 0.4660029,
        "tidalLock": false,
        "albedo": 	0.342,
        "orbit": {
          "type": "regular",
          "radius": 1429000000000,
          "offset": 0.15
        }
      },
      {
        "name": "Uranus",
        "type": "gasGiant",
        "parent": "Sol A",
        "mass": 8.6810e25,
        "radius": 25362000,
        "day": 62040,
        "axialTilt": 1.71042,
        "tidalLock": false,
        "albedo": 0.3,
        "orbit": {
          "type": "regular",
          "radius": 2875040000000,
          "offset": 0.77
        }
      },
      {
        "name": "Neptune",
        "type": "gasGiant",
        "parent": "Sol A",
        "mass": 1.0243e26,
        "radius": 24622000,
        "day": 57960,
        "axialTilt": 0.49427724,
        "tidalLock": false,
        "albedo": 0.290,
        "orbit": {
          "type": "regular",
          "radius": 4504450000000,
          "offset": 0.8
        }
      }
    ]
  }
};

export default systems;
