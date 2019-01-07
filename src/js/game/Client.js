import {setGameState, updateGameState} from '@/redux/reducers/game';


export default class Client {
  constructor(name, store, connector) {
    this.name = name;
    this.store = store;

    //connector deals with communications, e.g. ip address of remote server
    this.connector = connector;
    this.connector.setClient(this);
  }

  //contact the server and create a new game with this definition
  //server must be in initialising state
  createWorld(definition) {
    //c/onsole.log('[CLIENT] createWorld: ', definition);

    return this.connector.sendMessageToServer('createWorld', definition);
  }

  connect() {
    //c/onsole.log('[CLIENT] connect');

    return this.connector.sendMessageToServer('connectClient', {name: this.name})
  }

  setClientSettings(factions, factionId, ready) {
    //c/onsole.log('[CLIENT] set client settings: ', factions, factionId, ready);

    return this.connector.sendMessageToServer('setClientSettings', {name: this.name, factions, factionId, ready})
  }

  startGame() {
    //c/onsole.log('[CLIENT] startGame: ');

    return this.connector.sendMessageToServer('startGame', null)
  }

  //message handlers
  message_startingGame(gameState) {
    this.gameState = gameState;

    this.store.dispatch(setGameState(gameState))
  }

  message_updatingGame(gameState) {
    this.gameState = gameState;

    this.store.dispatch(updateGameState(gameState))
  }


  onMessageFromServer(messageType, data) {
    //c/onsole.log('[CLIENT] on message from server: ', messageType, data);

    const name = `message_${messageType}`;

    if(this[name]) {
      return this[name](data);
    }

    console.log('Unknown message from server: ', messageType, data);
  }

}
