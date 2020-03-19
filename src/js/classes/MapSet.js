//Helpers
import isIterable from '@/helpers/object/is-iterable';
import isSetEqual from '@/helpers/set/is-equal';


//The Class
export default class MapSet {
  store = null;

  constructor(iterable = undefined) {
    this.store = new Map();

    if(iterable) {
      if(isIterable(iterable)) {
        iterable.forEach(item => {
          if(!isIterable(iterable)) {
            throw new Error('MapSet: each item in the initial values must be an iterable value');
          }

          //convert to array if necessary
          item = item instanceof Array ? item : Array.from(item);

          this.set(item[0], ...items.slice(1));
        })
      } else if(typeof iterable === 'object') {
        for(let key in iterable) {
          const value = iterable[key];

          this.set(key, ...value);
        }
      }
    }
  }

  get = (key, asArray = false) => {
    const store = this.store;

    if(!store.has(key)) {
      return undefined;
    }

    const set = store.get(key);

    return asArray ?
      Array.from(set)
      :
      new Set(set)
  }

  set = (key, ...values) => {
    const store = this.store;
    let set = null;

    if(!store.has(key)) {
      set = new Set();
      store.set(key, set);
    } else {
      set = store.get(key);
    }

    values.forEach(value => {
      set.add(value);
    });
  }

  has = (key, value = undefined) => {
    const hasKey = this.store.has(key);

    if(!hasKey || value === undefined) {
      return hasKey;
    }

    return this.store.get(key).has(value);
  }

  delete = (key, value = undefined) => {
    const store = this.store;
    const hasKey = store.has(key);

    if(!hasKey) {
      return false;
    }

    if(value === undefined) {
      store.delete(key);

      return true;
    } else {
      const storeValue = store.get(key);

      if(storeValue.has(value)) {
        storeValue.delete(value);

        //set is empty, delete from store
        if(storeValue.size === 0) {
          store.delete(key);
        }

        return true;
      }

      return false;
    }
  }

  get size() {
    let count = 0;

    this.store.forEach((value, key) => {
      count += value.size;
    });

    return count;
  }

  get count() {
    return this.store.size;
  }

  toObject = () => {
    const output = {};

    this.forEachEntry((value, key) => {
      output[key] = value;
    }, true)

    return output;
  }

  forEach = (iterator) => {
    const store = this.store;

    store.forEach((set, key) => {
      set.forEach(value => {
        iterator(value, key);
      });
    })
  }

  forEachEntry = (iterator, asArray) => {
    const store = this.store;

    store.forEach((set, key) => {
      iterator(this.get(key, asArray), key);
    })
  }

  equals = (mapSet) => {
    if(!mapSet || mapSet.count !== this.count) {
      return false;
    }

    for(let [key, value] of this.store) {
      if(!mapSet.has(key) || !isSetEqual(value, mapSet.get(key))) {
        return false;
      }
    }

    return true;
  }

  [Symbol.iterator]() {
    return this.store[Symbol.iterator];//does this work?

    // let index?
    // //TODO
    // return {
    //   next: () => ({value: [the next value], done: [bool]})
    // };
  }
}
