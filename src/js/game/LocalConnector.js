import Server from '@/game/server/Server';


export default class LocalConnector {
  constructor() {
    this.server = new Server(this);
  }

  //client comms methods
  sendMessageToServer(messageType, data) {
    return this.server.onMessage(messageType, data, 1);
  }


  //Server comms methods
  broadcastToClients(messageType, data) {
    console.log('TODO broadcastToClients: ', messageType, data);
  }
}
