//Research, technology and components manager

import exprEval from 'expr-eval'

//Classes
import MapSet from '@/classes/MapSet';

//Helpers
import difference from '@/helpers/array/difference';
import filter from '@/helpers/object/filter';
import map from '@/helpers/object/map';
import forEach from '@/helpers/object/forEach';
import clone from '@/helpers/object/simple-clone';
import toString from '@/helpers/string/to-string';

//Constants
const parser = new exprEval.Parser();


//The class
export default class RTCManager {
  researchForTechnology = null;//a MapSet
  technologyForComponent = null;//a MapSet

  componentTypes = {};
  research = {}
  researchAreas = {}
  technology = {};
  components = {};

  componentTypePropertyEvaluators = {};
  componentTypeMineralEvaluators = {};

  //{[factionId]: Set([ids])}
  updatedResearch = {};
  updatedTechnology = {};
  updatedComponents = {};

  constructor(researchAreas, research, technology, componentTypes, components) {
    this.researchForTechnology = new MapSet();
    this.technologyForComponent = new MapSet();

    this.researchAreas = clone(researchAreas);

    forEach(research, (researchProject, id) => {
      this._addResearch(id, researchProject.factionId, researchProject);
    });

    forEach(technology, (technology, id) => {
      this._addTechnology(id, technology.factionId, technology)
    });

    //Component types
    this.componentTypes = clone(componentTypes);

    //build set of expression parsers for all component types
    this.componentTypePropertyEvaluators = map(this.componentTypes, (componentType) => {
      return map(componentType.properties || {}, exprStr => parser.parse(exprStr));
    });

    //mineral evaluators
    this.componentTypeMineralEvaluators = map(this.componentTypes, (componentType) => {
      return map(componentType.minerals, exprStr => parser.parse(exprStr));
    });

    //set components
    this.components = map(clone(components), component => {
      if(!component.factionId) {
        component.factionId = 0;
      }

      return component
    });
  }

  ////////////////////
  // Public methods //
  ////////////////////
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

    const requireResearchIds = this.researchForTechnology.getAll(neededTechnologies, true);

    const optionsStr = componentType.options.map(({id}) => componentOptions[id]).join(',');
    const componentId = `component-${componentTypeId}-[${optionsStr}]-${faction.id}`;

    if(this.research[componentId]) {
      //this project already exists!
      return false
    }

    this._addResearch(componentId, faction.id, {
      name,
      description: '',//TODO - wrong place for trans? <Trans>Project to create {name}</Trans>,
      cost: this.componentTypePropertyEvaluators[componentTypeId].rp.evaluate(componentOptions),
      area: componentType.researchAreaId,
      requireResearchIds,
      unlockTechnologyIds: [componentId]
    });

    console.log(this.research[componentId]);

    //add technology
    this._addTechnology(componentId, faction.id, {
      name,
      unlockComponentIds: [componentId]
    });

    //add component
    this._addComponent(componentId, faction.id, {
      name,
      componentTypeId,
      options: clone(componentOptions),
      properties: map(this.componentTypePropertyEvaluators[componentTypeId], (evaluator, propertyName) => {
        return evaluator.evaluate(componentOptions);
      }),
      minerals: map(this.componentTypeMineralEvaluators[componentTypeId], (evaluator, propertyName) => {
        return evaluator.evaluate(componentOptions);
      })
    });

    return componentId;//new research project ID (and component ID?)
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

  /////////////////////
  // Private methods //
  /////////////////////
  _addResearch(id, factionId, research) {
    factionId = factionId || 0;
    this.research[id] = research = clone(research);
    research.factionId = factionId;

    //update researchForTechnology
    research.unlockTechnologyIds && research.unlockTechnologyIds.forEach(technologyId => {
      this.researchForTechnology.set(technologyId, id);
    });

    if(factionId) {
      //mark this is something that the client needs to be informed of
      if(!this.updatedResearch[factionId]) {
        this.updatedResearch[factionId] = new Set();
      }

      this.updatedResearch[factionId].add(id);
    }
  }

  _addTechnology(id, factionId, technology) {
    factionId = factionId || 0;
    this.technology[id] = technology = clone(technology);
    technology.factionId = factionId;

    //get required research
    technology.requiredResearchIds = this.researchForTechnology.get(id, true);

    //update technologyForComponent
    technology.unlockComponentIds && technology.unlockComponentIds.forEach(componentId => {
      this.technologyForComponent.set(componentId, id);
    });

    if(factionId) {
      //mark this is something that the client needs to be informed of
      if(!this.updatedTechnology[factionId]) {
        this.updatedTechnology[factionId] = new Set();
      }

      this.updatedTechnology[factionId].add(id);
    }
  }

  _addComponent(id, factionId, component) {
    factionId = factionId || 0;
    this.components[id] = component = clone(component);
    component.factionId = factionId;

    component.requiredTechnologyIds = this.technologyForComponent.get(id, true);

    if(factionId) {
      //mark this is something that the client needs to be informed of
      if(!this.updatedComponents[factionId]) {
        this.updatedComponents[factionId] = new Set();
      }

      this.updatedComponents[factionId].add(id);
    }
  }
}
