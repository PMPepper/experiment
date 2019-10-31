import React from 'react';

import styles from './datatableSort.scss';

//Components
import Button from '@/components/button/Button';
import Icon from '@/components/icon/Icon';


//The components
const DatatableSort = React.forwardRef(function DatatableSort({rows, children, ...rest}) {
  const child = React.Children.only(children);

  return <div className={styles.datatableSort}>
    <div className={styles.table}>
      {React.cloneElement(
        child,
        {
          rows,
          ...rest,//other props


        }
      )}
    </div>
    <div className={styles.controls}>
      <Button><Icon icon="sort-up" /></Button>
      <Button><Icon icon="trash-alt" /></Button>
      <Button><Icon icon="sort-down" /></Button>
    </div>
  </div>
});

export default DatatableSort;
