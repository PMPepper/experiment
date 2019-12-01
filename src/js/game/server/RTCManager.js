//Research, technology and components manager

import exprEval from 'expr-eval'

//Helpers
import difference from '@/helpers/array/difference';
import filter from '@/helpers/object/filter';
import map from '@/helpers/object/map';
import toString from '@/helpers/string/to-string';

//Constants
const componentTypeGeneralProps = ['name', 'options', 'researchAreaId'];
const parser = new exprEval.Parser();


//The class
export default class RTCManager {
  componentTypes = {};
  research = {}
  researchAreas = {}
  technology = {};
  components = {};

  componentTypeEvaluators = {};

  //{[factionId]: Set([ids])}
  updatedResearch = {};
  updatedTechnology = {};
  updatedComponents = {};

  setComponents(components) {
    this.components = map(components, component => {
      if(!component.factionId) {
        component.factionId = 0;
      }

      return component
    });
  }

  setComponentTypes(componentTypes) {
    this.componentTypes = componentTypes;

    //build set of expression parsers for all component types
    this.componentTypeEvaluators = map(componentTypes, (componentType) => {
      return difference(Object.keys(componentType), componentTypeGeneralProps).reduce((output, prop) => {
        if(prop === 'minerals') {
          output.minerals = map(componentType.minerals, exprStr => parser.parse(exprStr));
        } else {
          output[prop] = parser.parse(componentType[prop]);
        }

        return output;
      }, {});
    })
  }

  addFactionComponent(faction, name, componentTypeId, componentOptions) {
    const componentType = this.componentTypes[componentTypeId]

    if(!componentType) {
      throw new Error('Unknown component type');
    }

    const neededTechnologies = new Set();//used to compile list of technoligies needed for this component

    //need to validate that supplied options are valid and this faction has the technologies required to create this.
    componentType.options.forEach(({id, name, values}) => {
      if(!(id in componentOptions)) {
        throw new Error('Component option missing');
      }

      //now check the value is valid
      const allowedValue = values.find(({value}) => toString(value) === toString(componentOptions[id]));

      if(!allowedValue) {
        throw new Error('Component option invalid');
      }

      //Finally, check that this faction has the required technologies
      if(allowedValue.requireTechnologyIds) {
        if(!allowedValue.requireTechnologyIds.every(technologyId => faction.faction.technology[technologyId])) {
          throw new Error('Component option missing required technology');
        }

        allowedValue.requireTechnologyIds.forEach(technologyId => neededTechnologies.add(technologyId))
      }
    })

    console.log(Array.from(neededTechnologies));
    const requireResearchIds = [];//TODO map from neededTechnologies

    const optionsStr = componentType.options.map(({id}) => componentOptions[id]).join(',');
    const componentId = `component-${componentTypeId}-[${optionsStr}]-${faction.id}`;

    console.log(componentId);

    if(this.research[componentId]) {
      //this project already exists!
      return false
    }

    this.addResearch(componentId, faction.id, {
      name,
      description: '',//TODO - wrong place for trans? <Trans>Project to create {name}</Trans>,
      cost: this.componentTypeEvaluators[componentTypeId].rp.evaluate(componentOptions),
      area: componentType.researchAreaId,
      requireResearchIds,
      unlockTechnologyIds: [componentId]
    });

    console.log(this.research[componentId]);

    //add technology
    this.addTechnology(componentId, faction.id, {
      name,
      unlockComponentIds: [componentId]
    });

    //add component
    this.addComponent(componentId, faction.id, {
      name,
      //TODO get calculated properities
    });

    //TODO need to record as part of this what technologies are required to be able design this technology?

    return componentId;//new research project ID (and component ID?)
  }

  addResearch(id, factionId, research) {
    this.research[id] = {
      ...research
    }

    factionId = factionId || 0;

    this.research[id].factionId = factionId;

    if(factionId) {
      //mark this is something that the client needs to be informed of
      if(!this.updatedResearch[factionId]) {
        this.updatedResearch[factionId] = new Set();
      }

      this.updatedResearch[factionId].add(id);
    }
  }

  addTechnology(id, factionId, technology) {
    this.technology[id] = {
      ...technology
    }

    factionId = factionId || 0;

    this.technology[id].factionId = factionId;

    if(factionId) {
      //mark this is something that the client needs to be informed of
      if(!this.updatedTechnology[factionId]) {
        this.updatedTechnology[factionId] = new Set();
      }

      this.updatedTechnology[factionId].add(id);
    }
  }

  addComponent(id, factionId, component) {
    this.components[id] = {
      ...component
    }

    factionId = factionId || 0;

    this.components[id].factionId = factionId;

    if(factionId) {
      //mark this is something that the client needs to be informed of
      if(!this.updatedComponents[factionId]) {
        this.updatedComponents[factionId] = new Set();
      }

      this.updatedComponents[factionId].add(id);
    }
  }

  getResearchUpdatesFor(factionId) {
    if(!this.updatedResearch[factionId]) {
      this.updatedResearch[factionId] = new Set();
    }

    if(this.updatedResearch[factionId].size) {
      const output = {};

      this.updatedResearch[factionId].forEach(researchId => {
        output[researchId] = this.research[researchId];
      });

      this.updatedResearch[factionId].clear();

      return output;
    }

    return false;
  }

  getTechnologyUpdatesFor(factionId) {
    if(!this.updatedTechnology[factionId]) {
      this.updatedTechnology[factionId] = new Set();
    }

    if(this.updatedTechnology[factionId].size) {
      const output = {};

      this.updatedTechnology[factionId].forEach(researchId => {
        output[researchId] = this.technology[researchId];
      });

      this.updatedTechnology[factionId].clear();

      return output;
    }

    return false;
  }

  getComponentUpdatesFor(factionId) {
    if(!this.updatedComponents[factionId]) {
      this.updatedComponents[factionId] = new Set();
    }

    if(this.updatedComponents[factionId].size) {
      const output = {};

      this.updatedComponents[factionId].forEach(researchId => {
        output[researchId] = this.components[researchId];
      });

      this.updatedComponents[factionId].clear();

      return output;
    }

    return false;
  }

  getGenericResearch() {
    return filter(this.research, research => research.factionId === 0)
  }

  getGenericTechnology() {
    return filter(this.technology, technology => technology.factionId === 0)
  }

  getGenericComponents() {
    return filter(this.components, component => component.factionId === 0)
  }

}
