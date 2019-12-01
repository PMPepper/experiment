import toId from '@/helpers/app/toId';
import toEntity from '@/helpers/app/toEntity';
import forEach from '@/helpers/object/forEach';

export default class ClientState {

  ////////////////////
  // cached getters //
  ////////////////////

  get gameTimeDate() {
    if(!this._gameTimeDate) {
      this._gameTimeDate = new Date(this.gameTime * 1000);
    }

    return this._gameTimeDate;
  }

  get factions() {
    if(!this._factions) {
      const entityIds = this.entityIds;
      const entities = this.entities;
      const factions = this._factions = [];
      let id = null;
      let entity = null;

      for(let i = 0; i < entityIds.length; i++) {
        id = entityIds[i];
        entity = entities[id];

        if(entity.type === 'faction') {
          factions.push(entity);
        }
      }
    }

    return this._factions;
  }

  get knownSystems() {
    if(!this._knownSystems) {
      const entityIds = this.entityIds;
      const entities = this.entities;
      const knownSystems = this._knownSystems = [];
      let id = null;
      let entity = null;

      for(let i = 0; i < entityIds.length; i++) {
        id = entityIds[i];
        entity = entities[id];

        if(entity.type === 'factionSystem') {
          knownSystems.push(entity);
        }
      }
    }

    return this._knownSystems;
  }

  get coloniesBySystemBySystemBody() {
    if(!this._coloniesBySystemBySystemBody) {
      const entityIds = this.entityIds;
      const entities = this.entities;
      const factionId = this.factionId;
      const coloniesBySystemBySystemBody = this._coloniesBySystemBySystemBody = {};
      const knownSystems = this.knownSystem;

      let id = null;
      let entity = null;


      for(let i = 0; i < entityIds.length; i++) {
        id = entityIds[i];
        entity = entities[id];

        if(entity.type === 'colony' && entity.factionId === factionId) {
          if(!coloniesBySystemBySystemBody[entity.systemId]) {
            coloniesBySystemBySystemBody[entity.systemId] = {};
          }

          coloniesBySystemBySystemBody[entity.systemId][entity.systemBodyId] = entity;
        }
      }
    }

    return this._coloniesBySystemBySystemBody;
  }

  ////////////////////////
  // Non-cached getters //
  ////////////////////////

  //could memoize?

  getRenderableEntities(systemId) {
    const entityIds = this.entityIds;
    const entities = this.entities;
    const renderableEntities = [];
    let id = null;
    let entity = null;

    for(let i = 0; i < entityIds.length; i++) {
      id = entityIds[i];
      entity = entities[id];

      if(entity.render && entity.systemId === systemId) {
        renderableEntities.push(entity);
      }
    }

    return renderableEntities;
  }

  getColoniesBySystemBody(systemId) {
    const entityIds = this.entityIds;
    const entities = this.entities;
    const factionId = this.factionId;
    const colonies = {};
    let id, entity;

    for(let i = 0; i < entityIds.length; i++) {
      id = entityIds[i];
      entity = entities[id];

      if(entity.type === 'colony' && entity.systemId === systemId && entity.factionId === factionId) {
        colonies[entity.systemBodyId] = entity;
      }
    }

    return colonies;
  }

  getFactionSystemFromSystem(system) {
    const entities = this.entities;
    const factionId = this.factionId;

    system = toEntity(system, entities);

    if(system && system.factionSystemIds) {
      const factionSystemId = system.factionSystemIds.find(factionSystemId => (entities[factionSystemId].factionId === factionId));

      return factionSystemId ? entities[factionSystemId] : null;
    }

    return null;
  }

  getFactionSystemBodyFromSystemBody(systemBody) {
    const entities = this.entities;
    const factionId = this.factionId;

    systemBody = toEntity(systemBody, entities);

    if(systemBody && systemBody.factionSystemBodyIds) {
      const factionSystemBodyId = systemBody.factionSystemBodyIds.find(factionSystemBodyId => (entities[factionSystemBodyId].factionId === factionId));

      return factionSystemBodyId ? entities[factionSystemBodyId] : null;
    }

    return null;
  }

  getColoniesForSystemBody(systemBody) {
    systemBody = +(systemBody.id || systemBody);//convert to id, if needed

    const entityIds = this.entityIds;
    const entities = this.entities;
    const factionId = this.factionId;
    const colonies = [];
    let id, entity;

    //TODO could use another cached getter, e.g. getFactionSystemBodies to thin down list..?
    for(let i = 0; i < entityIds.length; i++) {
      id = entityIds[i];
      entity = entities[id];

      if(entity.type === 'colony' && entity.systemBodyId === systemBody) {
        colonies.push(entity);
      }
    }

    return colonies;
  }

  /////////////////////////////
  // static creation methods //
  /////////////////////////////

  static fromState(state, gameConfig) {
    //TODO removed entities

    const clientState = new ClientState();

    clientState.gameConfig = gameConfig;
    clientState.factionId = state.factionId;
    clientState.entities = state.entities;
    clientState.gameTime = state.gameTime;
    clientState.desiredGameSpeed = state.desiredGameSpeed;
    clientState.gameSpeed = state.gameSpeed;
    clientState.isPaused = state.isPaused;

    clientState.entityIds = Object.keys(clientState.entities);

    return clientState;
  }

  static mergeState(oldState, newData) {
    const clientState = new ClientState();

    const entities = newData.entities;
    const stateEntities = oldState.entities;

    //added/altered entities
    for(let i = 0, keys = Object.keys(stateEntities), l = keys.length; i < l; ++i) {
      let key = keys[i];

      if(!entities[key]) {//if not in new entities, copy from old state
        entities[key] = stateEntities[key]
      }
    }

    //removed entities
    for(let i = 0, l = newData.removedEntities.length; i < l; i++) {
      delete entities[newData.removedEntities[i]]
    }

    //update client state props
    clientState.gameConfig = oldState.gameConfig;
    clientState.factionId = newData.factionId;
    clientState.entities = entities;
    clientState.gameTime = newData.gameTime;
    clientState.desiredGameSpeed = newData.desiredGameSpeed;
    clientState.gameSpeed = newData.gameSpeed;
    clientState.isPaused = newData.isPaused;

    newData.research && forEach(newData.research, (research, id) => {
      clientState.gameConfig.research[id] = research;
    });

    newData.technology && forEach(newData.technology, (technology, id) => {
      clientState.gameConfig.technology[id] = technology;
    });

    newData.components && forEach(newData.components, (component, id) => {
      clientState.gameConfig.components[id] = component;
    });

    clientState.entityIds = Object.keys(clientState.entities);

    return clientState;
  }
}
