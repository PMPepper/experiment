import React from 'react';
import {Trans} from '@lingui/macro'

import dataTableFactory from '@/components/datatable/DataTableFactory';



export default dataTableFactory([
  {
    name: 'name',
    label: <Trans>Name</Trans>,
    //valueType: 'string',
    //sort: true
  },
  {
    name: 'progress',
    label: <Trans>Progress</Trans>,
    format: function (...args) {
      console.log(args);

      return '-';
    }
    //valueType: 'number',
    //sort: true,
  },
  {
    name: 'eta',
    label: <Trans><abbr title="Estimated Time of Arrival">ETA</abbr></Trans>,
    format: function (...args) {
      console.log(args);

      return '-';
    }
  }
]);
