import React from 'react';

import Pagination from '@/components/pagination/Pagination';

import css from '@/helpers/css-class-list-to-string';


export default function Tfoot({styles, itemsPerPage, page, setPage, numRows, columns, stacked}) {
  return <tfoot className={css(styles.tfoot, stacked && styles.stacked)}>
    <tr className={css(styles.tfootRow, stacked && styles.stacked)}>
      <td className={css(styles.tfootTD, stacked && styles.stacked)} colSpan={columns.length}>
        <Pagination page={page} itemsPerPage={itemsPerPage} numItems={numRows} onRequestPagination={setPage} />
      </td>
    </tr>
  </tfoot>
}
