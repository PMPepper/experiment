import React from 'react';

//TODO re-order by clicking and dragging...

import styles from './datatableSort.scss';

//Components
import Button from '@/components/button/Button';
import Icon from '@/components/icon/Icon';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import childrenToArray from '@/helpers/react/children-to-array';


//The components
const DatatableSort = React.forwardRef(function DatatableSort({children, moveUp, moveDown, remove, ...rest}, ref) {
  children = childrenToArray(children);

  if(children.length === 0) {
    return null;
  }

  return <div className={styles.datatableSort} ref={ref}>
    <div className={styles.table}>
      {React.cloneElement(
        children[0],
        rest
      )}
      {children.slice(1)}
    </div>
    {(moveUp || remove || moveDown) && <div className={styles.controls}>
      {moveUp && <Button onClick={moveUp}><Icon icon="sort-up" /></Button>}
      {remove && <Button onClick={remove}><Icon icon="trash-alt" /></Button>}
      {moveDown && <Button onClick={moveDown}><Icon icon="sort-down" /></Button>}
    </div>}
  </div>
});

export default DatatableSort;
