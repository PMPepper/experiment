//import Server from './server/Server';

import Client from './Client';

export function startGame(gameDefinition, client) {
  return client.createWorld(gameDefinition)
    .then(() => {
      console.log('[Game] createWorld complete');

      return client.connect()
        .then((initialGameState) => {
          console.log('[Game] client connected');

          //TODO need a UI to select if multiple faction Ids
          const factionId = client.allFactionIds[0];

          return client.setClientSettings({[factionId]: 1}, factionId, true)
            .then(() => {
              console.log('[Game] client set settings');

              return client.startGame().then(() => {
                console.log('[Game] server started, ', client);

                client.setIsPaused(false);
                client.setDesiredSpeed(1);

                return client;
              });
            })
        })
    })
}
