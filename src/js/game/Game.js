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

                doFakeDevStuff(client)

                return client;
              });
            })
        })
    })
}


function doFakeDevStuff(client) {
  //research
  client.createResearchQueue(900, {"902":{"5":9}}, ["m1","r1","c1"]);

  //construction
  //colonyId, constructionProjectId, total, assignToPopulationId, takeFromPopulationId = null
  client.addBuildQueueItem(900, '1', 10, 901);
}

//TODO add fake stuff to help development - e.g. a research queue:
//{"structures":{"900":{"5":3}},"researchIds":["m1","pe"]}
