export default class ClientState {

  constructor() {

  }

  get gameTimeDate() {
    if(!this._gameTimeDate) {
      this._gameTimeDate = new Date(this.gameTime * 1000);
    }

    return this._gameTimeDate;
  }

  static fromState(state) {
    const clientState = new ClientState();

    clientState.entities = state.entities;
    clientState.gameTime = state.gameTime;
    clientState.desiredGameSpeed = state.desiredGameSpeed;
    clientState.gameSpeed = state.gameSpeed;
    clientState.isPaused = state.isPaused;

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

    clientState.entities = entities;
    clientState.gameTime = newData.gameTime;
    clientState.desiredGameSpeed = newData.desiredGameSpeed;
    clientState.gameSpeed = newData.gameSpeed;
    clientState.isPaused = newData.isPaused;

    return clientState;
  }
}
