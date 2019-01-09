//import Server from './server/Server';

import Client from './Client';

export function startGame(gameDefinition, client) {
  return client.createWorld(gameDefinition)
    .then(() => {
      console.log('[Game] createWorld complete');

      return client.connect()
        .then((initialGameState) => {
          console.log('[Game] client connected');//TODO this is a mess - factionId, etc should be in ClientState object

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
}
