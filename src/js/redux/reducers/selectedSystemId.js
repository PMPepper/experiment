import assignValueReducer, {assignValue} from '@/redux/HORs/assignValue';

export const SET_SELECTED_SYSTEM_ID = 'SET_SELECTED_SYSTEM_ID';


export default assignValueReducer(SET_SELECTED_SYSTEM_ID, 0)


//action creators
export function setSelectedSystemId(selectedSystemId) {
  return assignValue(SET_SELECTED_SYSTEM_ID, +selectedSystemId);
}
