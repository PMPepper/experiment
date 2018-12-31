import React from 'react';

import styles from './styles.scss';

import combineProps from '@/helpers/react/combine-props';

const defaultProps = {
  className: styles.btn,
  type: 'button'
};

export default function Button(props) {
  return <button {...combineProps(defaultProps, props)} />
}
