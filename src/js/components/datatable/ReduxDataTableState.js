import React from 'react';
//import memoize from 'memoize-one';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';

//helpers
import resolvePath from '@/helpers/object/resolve-path';

//reducers
import {getActionCreators} from '@/redux/HORs/datatable';


//The component
export default connect((state, {path}) => {
  return {
    datatableState: resolvePath(state, path)
  }
}, () => {
  //memoize action creators
  let lastId = null;
  let boundActionCreators = null;

  return (dispatch, {path, id}) => {
    id = id || path;

    if(id !== lastId) {
      lastId = id;
      boundActionCreators = bindActionCreators(getActionCreators(id), dispatch);
    }

    return boundActionCreators;
  }
})(
  function ReduxDataTableState ({children, datatableState, path, id, ...actions}) {
    const child = React.Children.only(children);

    return React.cloneElement(child, {...datatableState, ...actions});
  }
)
