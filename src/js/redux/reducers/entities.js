import {makeSchema, makeDefaultState, merge, removeByIds, set} from '@/helpers/redux/normalise';


import {SET_GAME_STATE, UPDATE_GAME_STATE} from '@/redux/reducers/game';

//Constants
const schema = makeSchema(
  'entities',
  'id',
  [
    'systemId', 'factionId', 'systemBodyId', 'factionSystemId',
    'factionSystemBodyId', 'speciesId', 'colonyId', 'populationId'
  ]
);
const DEFAULT_STATE = makeDefaultState(schema);


//The function
export default function entities(state = DEFAULT_STATE, action) {
  if(action.type === UPDATE_GAME_STATE) {
    return merge(
      removeByIds(state, schema, action.payload.removedEntities),
      action.payload.entities,
      schema
    );
  } else if(action.type === SET_GAME_STATE) {
    return set(action.payload.entities, schema);
  }

  return state;
}
