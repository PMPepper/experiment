//TODO:
//-armourTechnology
//-crewQuartersMass/required crew quarters

//Helpers
import forEach from '@/helpers/object/forEach';

//Constants
const componentSummaryProps = [
  'bp', 'crew', 'mass', 'crewCapacity', 'hitPoints', 'thrust', 'fuelConsumption', 'fuelStorage'
];


//The class
export default class ShipBlueprint {
  componentDefinitions = null;

  name = null;
  type = null;
  deploymentTime = 1;
  armourLayers = 1;
  armourTechnology = 1;
  factionId = null;
  flags = null;
  components = null;//{[componentId]: count}

  componentTotals = null;
  minerals = null;

  constructor({name = '', type = '', deploymentTime = 1, armourLayers = 1, armourTechnology = null, factionId = 0, flags = null, components = null} = {}, componentDefinitions) {
    this.name = name;
    this.type = type;
    this.deploymentTime = deploymentTime;
    this.armourLayers = armourLayers;
    this.armourTechnology = armourTechnology;
    this.factionId = factionId;

    this.flags = flags || {};

    this.components = {...components};

    this.componentDefinitions = componentDefinitions;

    this._updateProperties();
  }

  setComponent(componentId, qty = 1) {
    this.components[componentId] = qty+;

    this._updateProperties();
  }

  removeComponent(componentId) {
    delete this.components[componentId];

    this._updateProperties();
  }

  /////////////////////
  // Private methods //
  /////////////////////

  _updateProperties() {
    const totals = this.componentTotals = componentSummaryProps.reduce((output, property) => {output[property] = 0; return output}, {});
    const components = this.components;
    const componentDefinitions = this.componentDefinitions;
    const minerals = this.minerals = {};

    forEach(components, (qty, componentId) => {//for each component...
      const component = componentDefinitions[componentId];

      //...Sum all relevent component props...
      componentSummaryProps.forEach(property => {
        if(component.properties[property]) {
          totals[property] += component.properties[property] * qty;
        }
      });

      //...and add up required minerals
      forEach(component.minerals, (mineralsRequired, mineralId) => {
        if(!minerals[mineralId]) {
          minerals[mineralId] = 0;
        }

        minerals[mineralId] += mineralsRequired * qty;
      })
    });

    //TODO calculate crew berths (crew capacity / tonsPerCrew, where tonsPerCrew is calculated from the species and the deploymentTime)

    //TODO calculate volume, and surface area, and number of armour columns

    //Calculate armour mass/minerals/bp, based on  armour columns * armourLayers * armour mass per HP and the armour technology

    //TODO caculate total BP, mass, speed, minerals, etc
  }
}
