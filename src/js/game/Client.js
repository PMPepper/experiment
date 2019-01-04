


export default class Client {
  constructor(name, connector) {
    this.name = name;

    //connector deals with communications, e.g. ip address of remote server
    this.connector = connector;
  }

  //contact the server and create a new game with this definition
  //server must be in initialising state
  createWorld(definition) {
    console.log('[CLIENT] createWorld: ', definition);

    return this.connector.sendMessageToServer('createWorld', definition);
  }

  connect() {
    console.log('[CLIENT] connect');

    return this.connector.sendMessageToServer('connectClient', {name: this.name})
  }

  setClientSettings(factions, factionId, ready) {
    console.log('[CLIENT] set client settings: ', factions, factionId, ready);

    return this.connector.sendMessageToServer('setClientSettings', {name: this.name, factions, factionId, ready})
  }

  startGame() {
    console.log('[CLIENT] startGame: ');

    return this.connector.sendMessageToServer('startGame', null)
  }

}
