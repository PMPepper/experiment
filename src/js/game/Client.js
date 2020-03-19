import {setGameState, updateGameState} from '@/redux/reducers/game';
import {setSelectedSystemId} from '@/redux/reducers/selectedSystemId';

import find from '@/helpers/object/find';


export default class Client {
  constructor(name, store, connector) {
    this.name = name;
    this.store = store;

    //connector deals with communications, e.g. ip address of remote server
    this.connector = connector;
    this.connector.setClient(this);
  }

  /////////////////////
  // Getters/setters //
  /////////////////////

  get allFactionIds() {
    return Object.keys(this.gameConfig.factions).map(id => (+id));
  }


  ////////////////////////////////////
  // Client -> server comms methods //
  ////////////////////////////////////

  //contact the server and create a new game with this definition
  //server must be in initialising state
  createWorld(definition) {
    //c/onsole.log('[CLIENT] createWorld: ', definition);

    return this.connector.sendMessageToServer('createWorld', definition);
  }

  connect() {
    //c/onsole.log('[CLIENT] connect');

    return this.connector.sendMessageToServer('connectClient', {name: this.name}).then(gameConfig => {
      this.gameConfig = gameConfig;

      return true;
    })
  }

  setClientSettings(factions, factionId, ready) {
    //c/onsole.log('[CLIENT] set client settings: ', factions, factionId, ready);

    return this.connector.sendMessageToServer('setClientSettings', {name: this.name, factions, factionId, ready})
  }

  startGame() {
    //c/onsole.log('[CLIENT] startGame: ');

    return this.connector.sendMessageToServer('startGame', null)
  }

  //////////////////////
  // in game messages //
  //////////////////////

  setDesiredSpeed(speed) {
    //c/onsole.log('[CLIENT] setDesiredSpeed: ', speed);

    return this.connector.sendMessageToServer('setDesiredSpeed', speed)
  }

  setIsPaused(isPaused) {
    return this.connector.sendMessageToServer('setIsPaused', isPaused)
  }

  createColony = (bodyId) => {
    return this.connector.sendMessageToServer('createColony', bodyId)
  }

  // Research

  //facilities: {[structureId]: [number assigned]}
  //researchIds: array with order of projects to perform
  createResearchQueue = (colonyId, structures = {}, researchIds = []) => {
    return this.connector.sendMessageToServer('createResearchQueue', {colonyId, structures, researchIds})
  }

  //facilities: {[structureId]: [number assigned]}
  //researchIds: array with order of projects to perform
  updateResearchQueue = (researchQueueId, structures = {}, researchIds = []) => {
    return this.connector.sendMessageToServer('updateResearchQueue', {researchQueueId, structures, researchIds})
  }

  removeResearchQueue = (researchQueueId) => {
    return this.connector.sendMessageToServer('removeResearchQueue', researchQueueId)
  }

  // Construction
  addBuildQueueItem = (colonyId, constructionProjectId, total, assignToPopulationId, takeFromPopulationId = null) => {
    return this.connector.sendMessageToServer('addBuildQueueItem', {colonyId, constructionProjectId, total, assignToPopulationId, takeFromPopulationId})
  }

  removeBuildQueueItem = (colonyId, id) => {
    return this.connector.sendMessageToServer('removeBuildQueueItem', {colonyId, id})
  }

  reorderBuildQueueItem = (colonyId, id, newIndex) => {
    return this.connector.sendMessageToServer('reorderBuildQueueItem', {colonyId, id, newIndex})
  }

  updateBuildQueueItem = (colonyId, id, total, assignToPopulationId, takeFromPopulationId = null) => {
    return this.connector.sendMessageToServer('updateBuildQueueItem', {colonyId, id, total, assignToPopulationId, takeFromPopulationId})
  }

  //components
  addComponentProject = (name, componentTypeId, componentOptions) => {
    return this.connector.sendMessageToServer('addComponentProject', {name, componentTypeId, componentOptions})
  }

  ///////////////////////////////////////
  // Server -> Client message handlers //
  ///////////////////////////////////////
  message_startingGame(gameState) {
    this.gameState = gameState;

    this.store.dispatch(setSelectedSystemId(+find(gameState.entities, entity => (entity.type === 'factionSystem')).systemId));//TODO base on starting systems
    this.store.dispatch(setGameState(gameState, this.gameConfig))
  }

  message_updatingGame(gameState) {
    this.gameState = gameState;

    //Hmmm...
    this.store.dispatch(updateGameState(gameState, this.store.getState().entities))
  }

  //



  ////////////////////////////
  // Internal comms methods //
  ////////////////////////////
  onMessageFromServer(messageType, data) {
    //c/onsole.log('[CLIENT] on message from server: ', messageType, data);

    const name = `message_${messageType}`;

    if(this[name]) {
      return this[name](data);
    }

    console.log('Unknown message from server: ', messageType, data);
  }

}
