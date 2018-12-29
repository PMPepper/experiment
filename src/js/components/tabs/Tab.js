import React from 'react';
import styles from './styles.scss';

//Helpers
import css from '@/helpers/css/class-list-to-string';


export default function Tab(props) {
  return <div {...props} className={css(styles.tabContent, props.className)}>
    {props.children}
  </div>
}
