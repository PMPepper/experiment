import React, {useContext} from 'react';

import defaultStyles from './table.scss';

//Helpers
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';


//The component
const TableStyleContext = React.createContext(defaultStyles);
TableStyleContext.displayName = 'TableStyleContext';

const Table = React.forwardRef(function Table({styles, children, ...rest}, ref) {
  return <table {...combineProps({className: styles.table}, rest)} ref={ref}>
    <TableStyleContext.Provider value={styles}>
      {children}
    </TableStyleContext.Provider>
  </table>
});

Table.defaultProps = {
  styles: defaultStyles
};

export default Table;

Table.Row = React.forwardRef(function Row({children, highlighted, ...rest}, ref) {
  const styles = useContext(TableStyleContext);

  return <tr {...combineProps({className: css(styles.tr, highlighted && styles.highlighted)}, rest)} ref={ref}>
    {children}
  </tr>
});

Table.TH = React.forwardRef(function Row({children, ...rest}, ref) {
  const styles = useContext(TableStyleContext);

  return <th {...combineProps({className: styles.th}, rest)} ref={ref}>
    {children}
  </th>
});

Table.TD = React.forwardRef(function Row({children, ...rest}, ref) {
  const styles = useContext(TableStyleContext);

  return <td {...combineProps({className: styles.td}, rest)} ref={ref}>
    {children}
  </td>
});


Table.THead = React.forwardRef(function Row({children, ...rest}, ref) {
  const styles = useContext(TableStyleContext);

  return <thead {...combineProps({className: styles.thead}, rest)} ref={ref}>
    {children}
  </thead>
});

Table.TBody = React.forwardRef(function Row({children, ...rest}, ref) {
  const styles = useContext(TableStyleContext);

  return <tbody {...combineProps({className: styles.tbody}, rest)} ref={ref}>
    {children}
  </tbody>
});

Table.TFoot = React.forwardRef(function Row({children, ...rest}, ref) {
  const styles = useContext(TableStyleContext);

  return <tfoot {...combineProps({className: styles.tfoot}, rest)} ref={ref}>
    {children}
  </tfoot>
});
