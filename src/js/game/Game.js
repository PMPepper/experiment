//import Server from './server/Server';

import Client from './Client';

export function startGame(gameDefinition, client) {
  return client.createWorld(gameDefinition)
    .then(() => {
      console.log('[Game] createWorld complete');

      return client.connect()
        .then((initialGameState) => {
          console.log('[Game] client connected');

          const factionId = +Object.keys(initialGameState.factions).shift();

          return client.setClientSettings({[factionId]: 1}, factionId, true)
            .then(() => {
              console.log('[Game] client set settings');

              return client.startGame().then(() => {
                console.log('[Game] server started');

                return client;
              });
            })
        })
    })
  //TODO use game definition to configure server
  //const server = new Server();

  //server.message_createWorld(gameDefinition);
  //console.log(server);
  //return server

  //return Promise.resolve({});
}


//Server.debug();

//console.log(Server.getCachedEntities('factionSystems', faction1.id))
//console.log(Server.getCachedEntities('factionSystemBodies', faction1.id))
//console.log(Server.getCachedEntities('factionSystemBodiesGrouped', faction1.id))
