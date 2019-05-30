import React from 'react';

import styles from './form.scss';

import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';



export default function Legend({children, label, ...props}) {
  return <legend {...combineProps(props, {className: css(styles.legend, label && styles.asLabel)})}>{children}</legend>
}
