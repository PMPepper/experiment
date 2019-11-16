import React from 'react';
import {Trans} from '@lingui/macro'

import dataTableFactory from '@/components/datatable/DataTableFactory';



export default dataTableFactory([
  {
    name: 'name',
    label: <Trans>Name</Trans>,
    valueType: 'string',
    sort: true
  },
  {
    name: 'isMilitary',
    label: <Trans>Type</Trans>,
    valueType: 'bool',
    sort: true,
    format: (value) => {
      return value ? <Trans>Military</Trans> : <Trans>Civilian</Trans>
    }
  },
  {
    name: 'capacity',
    label: <Trans>Capacity</Trans>,
    valueType: 'number',
    sort: true
  },
  {
    name: 'slipways',
    label: <Trans># Slipways</Trans>,
    valueType: 'number',
    sort: true
  }
]);
