import resolvePath, {normalisePath} from './resolve-path';

//Immutably modify simple objects
//Doesn't deal with functions, symbols - only really intended for primitives, objects and arrays
export default function modify(obj, ...paths/*path, newValue*/) {
  if(paths.length % 2 !== 0) {
    throw new Error('modify requires pairs of path/newValue arguments')
  }

  for(let i = 0; i < paths.length; i+= 2) {
    const path = normalisePath(paths[i]);
    const newValue = paths[i+1];

    if(resolvePath(obj, path) !== newValue) {//newValue is not the same as the current value at that path. Object(s) need to change
      //create new base object
      obj = clone(obj);

      let curObj = obj;
      const endIndex = path.length - 1;

      path.forEach(function(curPath, index) {
        if(index !== endIndex) {
          //clone objects on path, and modify them to reference their new cloned children as needed
          curObj[curPath] = clone(curObj[curPath]);
          curObj = curObj[curPath];
        } else {
          //At the end of the path, assign newValue
          curObj[curPath] = newValue;
        }
      });
    }
  }

  return obj;
}

//What about things like functions, symbols etc? Not supported for now.
function clone(obj) {
  switch(typeOf(obj)) {
    case 'array':
      return [...obj];
    case 'object':
      return {...obj};
    case 'undefined':
      return {};
    default:
      return obj;
  }
}

function typeOf(obj) {
  if(obj instanceof Array) {
    return 'array';
  }

  return typeof(obj);
}
