import React, {useContext} from 'react';


import defaultStyles from './dl.scss';
import gridDL from './gridDL.scss';

//Helpers
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';

const DLContext = React.createContext(null);
DLContext.displayName = 'DLContext';

//The component
const DL = React.forwardRef(function DL({styles, children, wide, wideTerm, veryWideTerm, ...rest}, ref) {
  return <dl {...combineProps({className: css(styles.dl, wide && styles.wide, wideTerm && styles.wideTerm, veryWideTerm && styles.veryWideTerm)}, rest)} ref={ref}>
    <DLContext.Provider value={styles}>
      {children}
    </DLContext.Provider>
  </dl>
});

export default DL;

//Child components
DL.Term = React.forwardRef(function Term({children, ...rest}, ref) {
  const styles = useContext(DLContext);

  return <dt {...combineProps({className: styles.dt}, rest)} ref={ref}>
    {children}
  </dt>
});

DL.Definition = React.forwardRef(function Definition({children, ...rest}, ref) {
  const styles = useContext(DLContext);

  return <dd {...combineProps({className: styles.dd}, rest)} ref={ref}>
    {children}
  </dd>
});

//Default props
DL.defaultProps = {
  styles: defaultStyles
};

DL.dlStyles = defaultStyles;
DL.gridDLStyles = gridDL;
