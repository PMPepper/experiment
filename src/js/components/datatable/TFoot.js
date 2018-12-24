import React from 'react';

import Pagination from '@/components/pagination/Pagination';


export default function TFoot({styles, itemsPerPage, page, setPage, numRows, columns}) {
  return <tfoot styles={styles.tfoot}>
    <tr className={styles.tFootRow}>
      <td className={styles.tFootTD} colSpan={columns.length}>
        <Pagination page={page} itemsPerPage={itemsPerPage} numItems={numRows} onRequestPagination={setPage} />
      </td>
    </tr>
  </tfoot>
}
