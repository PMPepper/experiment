import React, {useContext} from 'react';

//Components
import Label from './Label';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import Checkboxes from './Checkboxes';

//Hooks
import useId from '@/hooks/useId';
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import childrenToArray from '@/helpers/react/children-to-array';

//Other
import {StyleContext} from './contexts';

//Consts
const inputyTypes = [Input, Select, Textarea, Checkboxes];//Element types that are form inputs


//The component
const Field = React.forwardRef(function Field({children, id, name, inline, columns, width, ...props}, ref) {
  id = useId(id, 'field');
  const className = useGetLayoutClasses('field', columns, width);
  const styles = useContext(StyleContext);


  let label = null;
  let input = null;
  let Component = 'div';
  let role = null;
  let labelledBy = null;

  //Extract and add props to children
  const childrenArray = childrenToArray(children).map(child => {
    if(inputyTypes.includes(child.type)) {
      return input = React.cloneElement(child, {id, name, inline});
    }

    if(child.type === Label) {
      return label = React.cloneElement(child, {htmlFor: id, inline});
    }

    return child;
  });

  //handle special rendering cases
  const isCheckbox = input && input.props.type === 'checkbox';
  const isCheckboxes = input && input.type === Checkboxes;

  let contents = null;

  if(isCheckbox) {
    contents = [input, label, filterOutFormElements(childrenArray)];
  }
  else if(isCheckboxes) {
    //Component = 'fieldset';
    role = 'group';
    labelledBy = label.props.id || `${id}-legend`;

    //TODO labelled by

    contents = label ?
      [Checkboxes.labelToLegend(label, labelledBy), input, filterOutFormElements(childrenArray)]
      :
      [input, filterOutFormElements(childrenArray)]
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

      //columns = numberToName(numVisibleChildren);
    }
  }

  return <Component {...combineProps({role, 'aria-labelledby': labelledBy, className: css(className, isCheckbox && styles.isCheckbox, inline && styles.inline)}, props)} ref={ref}>
    {contents}
  </Component>
});

export default Field;

function filterOutFormElements(children) {
  return children.filter(child => (child.type !== Input && child.type !== Checkboxes && child.type !== Label));
}
