import React, {useContext} from 'react';

//Hooks
import useGetLayoutClasses from './useGetLayoutClasses';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import base64Encode from '@/helpers/string/base64Encode';

//Other
import {StyleContext} from './contexts';


//The component
const Checkboxes = React.forwardRef(function Checkboxes({options, inline, name, id, vertical, horizontal, columns, width, ...props}, ref) {
  const className = useGetLayoutClasses('checkboxes', columns, inline ? width : 0);
  const styles = useContext(StyleContext);

  //orientation - defaults to vertical (if both or neither are true, uses vertical)
  vertical = !!vertical || !horizontal;
  horizontal = !vertical;

  return <div {...combineProps(props, {className: css(className, inline && styles.inline, vertical && styles.vertical, horizontal && styles.horizontal)})} ref={ref}>
    {options.map(option => {
      const inputId = `${id}_${base64Encode(option.value)}`;

      return <label className={css(styles.checkboxesItem, styles['width-1'])} key={option.value} htmlFor={inputId}>
        <input className={css(styles.checkboxesInput)} type="checkbox" value={option.value} name={name} id={inputId} />
        <span className={css(styles.checkboxesLabel)}>{option.label}</span>
      </label>
    })}
  </div>
});

Checkboxes.labelToLegend = function labelToLegend(label, id) {
  return React.cloneElement(label, {component: 'div', htmlFor: null, id});
}

export default Checkboxes;
