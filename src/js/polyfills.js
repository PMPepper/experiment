const polyfills = [];

//TODO: right now, no browser supports this property, so there is no test
import 'wicg-inert';

// if (!window.fetch) {
//   polyfills.push(import(/* webpackChunkName: "polyfill-fetch" */ 'whatwg-fetch'))
// }

export default Promise.all(polyfills);
