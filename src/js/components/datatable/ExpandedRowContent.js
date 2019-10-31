import React from 'react';

import styles from './expandedRowContent.scss';

//Helpers
import combineProps from '@/helpers/react/combine-props';


//The component
const ExpandedRowContent = React.forwardRef(function ExpandedRowContent(props, ref) {
  return <div {...combineProps({className: styles.expandedRowContents}, props)} ref={ref} />
});

export default ExpandedRowContent;
