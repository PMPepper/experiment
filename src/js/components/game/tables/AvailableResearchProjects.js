import React from 'react';
import {Trans} from '@lingui/macro'

import dataTableFactory from '@/components/datatable/DataTableFactory';



export default dataTableFactory([
  {
    name: 'name',
    label: <Trans>Project</Trans>,
    valueType: 'string',
    sort: true
  },
  {
    name: 'cost',
    label: <Trans>RPs</Trans>,
    valueType: 'number',
    sort: true,
  },
]);
