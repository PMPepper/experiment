import React from 'react';

//TODO re-order by clicking and dragging...

import styles from './reorder.scss';

//Components
import Button from '@/components/button/Button';
import Icon from '@/components/icon/Icon';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';
import childrenToArray from '@/helpers/react/children-to-array';


//The components
const Reorder = React.forwardRef(function Reorder({children, moveUp, moveDown, remove, disableMoveUp, disableMoveDown, disableRemove, ...rest}, ref) {
  children = childrenToArray(children);

  if(children.length === 0) {
    return null;
  }

  return <div className={styles.reorder} ref={ref}>
    <div className={styles.content}>
      {React.cloneElement(
        children[0],
        rest
      )}
      {children.slice(1)}
    </div>
    {(moveUp || remove || moveDown) && <div className={styles.controls}>
      {moveUp && <Button onClick={moveUp} disabled={disableMoveUp}><Icon icon="sort-up" /></Button>}
      {remove && <Button onClick={remove} disabled={disableRemove}><Icon icon="trash-alt" /></Button>}
      {moveDown && <Button onClick={moveDown} disabled={disableMoveDown}><Icon icon="sort-down" /></Button>}
    </div>}
  </div>
});

export default Reorder;
