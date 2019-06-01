import React from 'react';
import {compose} from 'recompose';

import styles from './form.scss';

//HOCs
import NumberOfColumnsHOC from './NumberOfColumnsHOC';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import base64Encode from '@/helpers/string/base64Encode';

//Contexts
import {ColumnsContext} from './Form';


//The component
const Checkboxes = compose(
  NumberOfColumnsHOC
)(function Checkboxes({options, inline, name, id, vertical, horizontal, columns = 1, ...props}) {
  return <ColumnsContext.Consumer>{(columnsData) => {
    let fieldColumns = columnsData && columnsData.columns;
    //orientation - defaults to vertical (if both or neither are true, uses vertical)
    vertical = !!vertical || !horizontal;
    horizontal = !vertical;

    return <div {...combineProps(props, {className: css(styles.checkboxes, inline && styles.inline, inline && styles[fieldColumns || 'one'], vertical && styles.vertical, horizontal && styles.horizontal, styles[`columns_${columns}`])})}>
      {options.map(option => {
        const inputId = `${id}_${base64Encode(option.value)}`;

        return <label className={css(styles.checkboxesItem)} key={option.value} htmlFor={inputId}>
          <input className={css(styles.checkboxesInput)} type="checkbox" value={option.value} name={name} id={inputId} />
          <span className={css(styles.checkboxesLabel)}>{option.label}</span>
        </label>
      })}
    </div>
  }}</ColumnsContext.Consumer>
});

Checkboxes.labelToLegend = function labelToLegend(label, id) {
  return React.cloneElement(label, {component: 'div', htmlFor: null, id});
}

export default Checkboxes;
