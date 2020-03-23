export default {
  name: 'Fuel tank',
  designable: false,

  //These are for designing only
  //researchAreaId: 8,
  //properties: {},
  //minerals: {},
  //propertiesDesignLayout: [  ],
  //options: [],

  propertiesListLayout: [
    {property: 'bp'},
    {property: 'mass'},
    {property: 'fuelStorage'},
  ],

  propertiesDetailsLayout: [
    {property: 'bp'},
    {property: 'mass'},
    {property: 'fuelStorage'},
  ],
}
