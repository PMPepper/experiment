import React from 'react';



export default function TFoot({styles, pagination, columns}) {
  return <tfoot styles={styles.tfoot}>
    <tr className={styles.tFootRow}>
      <td className={styles.tFootTD} colSpan={columns.length}>[TODO pagination]</td>
    </tr>
  </tfoot>
}
