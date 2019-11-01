import React from 'react';
import {Trans} from '@lingui/macro';

import styles from './researchQueueOverview.scss';

//Components
import Button from '@/components/button/Button';
import Buttons from '@/components/button/Buttons';
import Progress from '@/components/progress/Progress';
import DL from '@/components/list/DL';


//The component
const ResearchQueueOverview = React.forwardRef(function ResearchQueueOverview({researchQueue, onEditClick, onRemoveClick}, ref) {
  return <div ref={ref} className={styles.researchQueueOverview}>
    <div className={styles.structures}>
      <DL>

      </DL>
    </div>
    <div className={styles.research}>
      <Progress value={50} max={100} />
    </div>
    <Buttons position="right">
      {onEditClick && <Button onClick={() => {onEditClick(researchQueue.id);}}><Trans id="researchQueueOverview.edit">Edit</Trans></Button>}
      {onRemoveClick && <Button onClick={() => {onRemoveClick(researchQueue.id);}}><Trans id="researchQueueOverview.remove">Remove</Trans></Button>}
    </Buttons>
  </div>
});

export default ResearchQueueOverview;
