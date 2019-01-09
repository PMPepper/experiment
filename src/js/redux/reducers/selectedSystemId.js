import assignValueReducer, {assignValue} from '@/redux/HORs/assignValue';

const reduxId = 'selectedSystemId';


export default assignValueReducer(reduxId, 0)


//action creators
export function setSelectedSystemId(selectedSystemId) {
  return assignValue(reduxId, selectedSystemId);
}
