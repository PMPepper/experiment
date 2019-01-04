import Server from './server/Server';

import systems from './data/systems';

export function startGame(gameDefinition) {
  //TODO use game definition to configure server
  const server = new Server();

  server.createWorld(gameDefinition);
  console.log(server);
  return server
}


//Server.debug();

//console.log(Server.getCachedEntities('factionSystems', faction1.id))
//console.log(Server.getCachedEntities('factionSystemBodies', faction1.id))
//console.log(Server.getCachedEntities('factionSystemBodiesGrouped', faction1.id))
