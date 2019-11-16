//Benchmarked using Object and Set as alternative datastructures, array was
//the fastest option


export default class EntityProcessor {
  constructor(entityTestFunction, entityProcessFactory) {
    this.entities = [];
    this.entityTestFunction = entityTestFunction;
    this.entityProcessFactory = entityProcessFactory;
  }

  addEntity(entity) {
    if(this.entityTestFunction(entity)) {
      //add the entity
      this._add(entity)
    }
  }

  //called when an entity has changed. Checks if entity needs to be added/removed
  updateEntity(entity) {
    const shouldHaveEntity = this.entityTestFunction(entity);

    if(this.hasEntity(entity)) {
      if(!shouldHaveEntity) {
        this.removeEntity(entity);
      }
    } else {
      if(shouldHaveEntity) {
        this.addEntity(entity);
      }
    }
  }

  removeEntity(entity) {
    if(this.hasEntity(entity)) {
      const index = this.entities.indexOf(entity);
      this.entities.splice(index, 1);
    }
  }

  hasEntity(entity) {
    return this.entities.includes(entity);
  }

  processEntitites(allAlteredEntities, lastTime, time, entities, gameConfig, init = false, full = false) {
    //factory will return a boolean
    const entityProcessorFunc = this.entityProcessFactory(lastTime, time, init, full);

    if(entityProcessorFunc) {
      for(let i = 0, items = this.entities, l = items.length; i < l; i++) {
        const entity = items[i];

        if(entityProcessorFunc(entity, entities, gameConfig)) {
          allAlteredEntities.add(entity);
        }
      }
    }
  }

  //do I need this?
  forEachEntity(func) {
    this.entities.forEach(func);
  }

  get count() {
    return this.entities.length;
  }

  //Internal methods
  _add(entity) {
    if(!this.hasEntity(entity)) {
      this.entities.push(entity);
    }
  }


}
