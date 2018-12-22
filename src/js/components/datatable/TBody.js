import React from 'react';



export default function TFoot({styles, children}) {
  return <tbody className={styles.tbody}>
    {children}
  </tbody>
}
