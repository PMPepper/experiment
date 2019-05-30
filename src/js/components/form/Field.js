import React from 'react';
import {compose} from 'recompose';

import styles from './form.scss';

//HOCs
import NumberOfColumnsHOC, {numberToName} from './NumberOfColumnsHOC';
import IDComponent from '@/HOCs/IDComponent';

//Components
import Label from './Label';
import Input from './Input';
import Select from './Select';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import childrenToArray from '@/helpers/react/children-to-array';
import getChildrenOfType from '@/helpers/react/get-children-of-type';
import getChildrenNotOfType from '@/helpers/react/get-children-not-of-type';


const inputyTypes = [Input, Select];//Element types that are form inputs


export default compose(
  NumberOfColumnsHOC,
  IDComponent({prefix: 'field'})
)(function Field({numberOfColumns, columns, wide, children, id, name, inline, ...props}) {
  let label = null;
  let input = null;

  //add props to children
  const childrenArray = childrenToArray(children).map(child => {
    if(inputyTypes.includes(child.type)) {
      return input = React.cloneElement(child, {id, name, inline});
    }

    if(child.type === Label) {
      return label = React.cloneElement(child, {htmlFor: id, inline});
    }

    return child;
  });

  const isCheckbox = input && input.props.type === 'checkbox';

  let contents = null;

  if(isCheckbox) {
    contents = [input, label, childrenArray.filter(child => (child.type !== Input && child.type !== Label))];
  } else {
    //not a checkbox
    contents = childrenArray;

    if(inline && !columns) {//if inline but no columns specified, assume one per child
      const numVisibleChildren = contents.reduce((count, child) => {
        if((child.type === Label || inputyTypes.includes(child.type)) && child.props.hide) {
          return count;//do no increment count for elements set to hidden
        }

        //otherwise count element
        return count + 1;
      }, 0);
      columns = numberToName(numVisibleChildren);
      wide = true;
    }
  }

  return <div {...combineProps({className: css(styles.field, wide && styles.wide, columns && styles[columns], isCheckbox && styles.isCheckbox, inline && styles.inline)}, props)}>
    {contents}
  </div>
});

function firstOrNull(arr) {
  if(arr && arr.length > 0) {
    return arr[0];
  }

  return null;
}
