import makePropType from './_make-prop-type';
import isReactComponent from '@/helpers/is-react-component';


export default makePropType(function isReactComponentTest(props, propName, componentName) {
  const prop = props[propName];

  if(!isReactComponent(prop)) {
    return new Error(`Invalid prop ${propName} supplied to ${componentName}. Is not a valid react component, was '${prop}'`);
  }

  return null;
})
