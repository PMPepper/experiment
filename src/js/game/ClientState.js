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
    let id = null;
    let entity = null;

    for(let i = 0; i < entityIds.length; i++) {
      id = entityIds[i];
      entity = entities[id];

      if(entity.type === 'colony' && entity.systemId === systemId && entity.factionId === factionId) {
        colonies[entity.systemBodyId] = entity;
      }
    }

    return colonies;
  }

  /////////////////////////////
  // static creation methods //
  /////////////////////////////

  static fromState(state) {
    //TODO removed entities

    const clientState = new ClientState();

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

    for(let i = 0, keys = Object.keys(stateEntities), l = keys.length; i < l; ++i) {
      let key = keys[i];

      if(!entities[key]) {//if not in new entities, copy from old state
        entities[key] = stateEntities[key]
      }
    }

    clientState.factionId = newData.factionId;
    clientState.entities = entities;
    clientState.gameTime = newData.gameTime;
    clientState.desiredGameSpeed = newData.desiredGameSpeed;
    clientState.gameSpeed = newData.gameSpeed;
    clientState.isPaused = newData.isPaused;

    clientState.entityIds = Object.keys(clientState.entities);

    return clientState;
  }
}
