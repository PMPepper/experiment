import React from 'react';
import {Trans} from '@lingui/macro'

import dataTableFactory from '@/components/datatable/DataTableFactory';

//Components
import FormatDate from '@/components/formatDate/FormatDate';


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
    format: function (value, column, row, props) {


      return '-';
    }
    //valueType: 'number',
    //sort: true,
  },
  {
    name: 'eta',
    label: <Trans><abbr title="Estimated Time of Arrival">ETA</abbr></Trans>,
    format: function (value, column, row, props) {
      return value instanceof Date ?
        <FormatDate value={value} format="date" />
        :
        '-';
    }
  }
]);
