import React from 'react';

import css from '@/helpers/css-class-list-to-string';


export default function TFoot({styles, children, stacked}) {
  return <tbody className={css(styles.tbody, stacked && styles.tbodyStacked)}>
    {children}
  </tbody>
}
