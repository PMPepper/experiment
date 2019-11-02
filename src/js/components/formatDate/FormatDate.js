import React from 'react';
import PropTypes from 'prop-types';
import {Trans} from '@lingui/macro';


import formatDate from '@/helpers/date/format-date';


//this component is Pure
export default function FormatDate({value, langCode = null, format = null, timeZone = 'UTC'}) {
  if(value === null) {
    return <Trans id="formatDate.invalid">-</Trans>
  }
  
  return formatDate(value, langCode, format, timeZone);
}

if(process.env.NODE_ENV !== 'production') {
  FormatDate.propTypes = {
    value: PropTypes.instanceOf(Date),
    langCode: PropTypes.string,
    format: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ])
  };
}
