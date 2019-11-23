import range from 'range-inclusive';

export default {
  name: 'Engine',

  //required props
  mass: 'size * 10',
  rp: 'size * et * p * 5',
  bp: 'size * et * p * 0.5',
  hitpoints: 'size/2',
  crew: 'size * p',
  explosionChance: '0.1 * p',
  minerals: {
    "7": 'size * et * p * 0.5'
  },

  //engine specific props
  thermal: '(size * et * p)',//TODO thermal reduction tech (LOW priority)
  thrust: 'size * et * p',
  fuelConsumption: '(size * et * p) * p^2.5 * eff * (1 - (size / 100))',

  options: [
    {
      id: 'et',
      name: 'Engine technology',
      values: [
        {
          label: 'Improved PE drive technology',
          value: 8,
          requireTechnologyIds: ['e2']
        },
        {
          label: 'PE drive technology',
          value: 5,
          requireTechnologyIds: ['e1']
        },
        {
          label: 'Conventional engine technology',
          value: 0.2,
          requireTechnologyIds: []
        }
      ]
    },
    {
      id: 'p',
      name: 'Power/efficiency modifier',
      default: 1,
      values: [
        {
          label: 'Engine Power 75%, fuel use per ETH 49%',
          value: 0.75,
          requireTechnologyIds: []
        },
        {
          label: 'Engine Power 80%, fuel use per ETH 57%',
          value: 0.8,
          requireTechnologyIds: []
        },
        {
          label: 'Engine Power 85%, fuel use per ETH 67%',
          value: 0.85,
          requireTechnologyIds: []
        },
        {
          label: 'Engine Power 90%, fuel use per ETH 77%',
          value: 0.9,
          requireTechnologyIds: []
        },
        {
          label: 'Engine Power 95%, fuel use per ETH 88%',
          value: 0.95,
          requireTechnologyIds: []
        },
        {
          label: 'Engine Power 100%, fuel use per ETH 100%',
          value: 1,
          requireTechnologyIds: []
        }
      ]
    },
    {
      id: 'eff',
      name: 'Fuel consumpion',
      values: [
        {
          label: '0.1 Litre per Engine Thrust Hour',
          value: 0.1,
          requireTechnologyIds: ['fe9']
        },
        {
          label: '0.2 Litre per Engine Thrust Hour',
          value: 0.2,
          requireTechnologyIds: ['fe8']
        },
        {
          label: '0.3 Litre per Engine Thrust Hour',
          value: 0.3,
          requireTechnologyIds: ['fe7']
        },
        {
          label: '0.4 Litre per Engine Thrust Hour',
          value: 0.4,
          requireTechnologyIds: ['fe6']
        },
        {
          label: '0.5 Litre per Engine Thrust Hour',
          value: 0.5,
          requireTechnologyIds: ['fe5']
        },
        {
          label: '0.6 Litre per Engine Thrust Hour',
          value: 0.6,
          requireTechnologyIds: ['fe4']
        },
        {
          label: '0.7 Litre per Engine Thrust Hour',
          value: 0.7,
          requireTechnologyIds: ['fe3']
        },
        {
          label: '0.8 Litre per Engine Thrust Hour',
          value: 0.8,
          requireTechnologyIds: ['fe2']
        },
        {
          label: '0.9 Litre per Engine Thrust Hour',
          value: 0.9,
          requireTechnologyIds: ['fe1']
        },
        {
          label: '1 Litre per Engine Thrust Hour',
          value: 1,
          requireTechnologyIds: []
        },
      ]
    },
    //TODO thermal
    {
      id: 'size',
      name: 'Engine size',
      values: range(1, 50).map(size => ({
        label: `${size * 10} ton, fuel consumption -${size}% `,
        value: size,
        requireTechnologyIds: []
      }))
    }
  ]
}
