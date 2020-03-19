// import {useSelector, shallowEqual} from 'react-redux'
//
//
// //The hook
// // -types is a Set of types
// export default function useEntitiesByType(types) {
//   const output = {};
//
//   types.forEach(type => {
//     output[type] = {};
//   });
//
//   return useSelector(state => {
//     for(var i = 0; i < state.entities.allIds.length; i++) {
//       const id = state.entities.allIds[i];
//       const entity = state.entities.byId[id];
//
//       if(types.has(entity.type)) {
//         output[type][id] = entity;
//       }
//     }
//   }, shallowEqual);
// }
