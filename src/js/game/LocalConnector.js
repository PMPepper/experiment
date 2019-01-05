import Server from '@/game/server/Server';


export default class LocalConnector {
  server = null;
  client = null;

  constructor() {
    this.server = new Server(this);
  }

  //client comms methods
  setClient(client) {
    this.client = client;
  }

  sendMessageToServer(messageType, data) {
    return this.server.onMessage(messageType, data, 1);
  }


  //Server comms methods
  broadcastToClients(messageType, data) {
    console.log('[LC] broadcastToClients: ', messageType, data);

    return this.client.onMessageFromServer(messageType, cloneMessage(data));
  }

  sendMessageToClient(connectionId, messageType, data) {
    if(!connectionId === 1) {
      throw new Error('Invalid connectionId');
    }

    console.log('[LC] sendMessageToClient: ', messageType, data);

    return this.client.onMessageFromServer(messageType, cloneMessage(data));

  }
}

function cloneMessage(data) {
  return JSON.parse(JSON.stringify(data));
}
