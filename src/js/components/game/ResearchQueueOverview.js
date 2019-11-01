import React from 'react';
import {Trans} from '@lingui/macro';

import styles from './researchQueueOverview.scss';

//Components
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';


//The component
const ResearchQueueOverview = React.forwardRef(function ResearchQueueOverview({researchQueue, onEditClick, onRemoveClick}, ref) {
  return <div ref={ref} className={styles.researchQueueOverview}>
    TODO
    <Buttons position="right">
      {onEditClick && <Button onClick={() => {onEditClick(researchQueue.id);}}><Trans id="researchQueueOverview.edit">Edit</Trans></Button>}
      {onRemoveClick && <Button onClick={() => {onRemoveClick(researchQueue.id);}}><Trans id="researchQueueOverview.remove">Remove</Trans></Button>}
    </Buttons>
  </div>
});

export default ResearchQueueOverview;
