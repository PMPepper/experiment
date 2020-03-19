import {useSelector, shallowEqual} from 'react-redux';

//Helpers
import resolvePath from '@/helpers/object/resolve-path';


//The hook
export default function useReduxSlice(path, filter) {
  useSelector(state => {
    const slice = resolvePath(state, path);


  })
}
