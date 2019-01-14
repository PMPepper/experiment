import React from 'react';
import {Trans} from "@lingui/macro"

import dataTableFactory from '@/components/datatable/DataTableFactory';



export default dataTableFactory([
  {
    name: 'mineral',
    label: <Trans>Mineral</Trans>,
    valueType: 'string',
    sort: true
  },
  {
    name: 'quantity',
    label: <Trans>Quantity</Trans>,
    valueType: 'number',
    sort: true,
  },
  {
    name: 'access',
    label: <Trans>Access</Trans>,
    valueType: 'number',
    sort: true
  },
  {
    name: 'production',
    label: <Trans>Annual production</Trans>,
    valueType: 'number',
    sort: true
  },
  {
    name: 'depletion',
    label: <Trans>Years to depletion</Trans>,
    valueType: 'number',
    sort: true
  },
  {
    name: 'stockpile',
    label: <Trans>Stockpile</Trans>,
    valueType: 'number',
    sort: true
  }
]);
