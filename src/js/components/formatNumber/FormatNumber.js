import React from 'react';
import PropTypes from 'prop-types';
import {Trans} from '@lingui/macro';

import formatNumber from '@/helpers/string/format-number';
import isInteger from '@/prop-types/is-integer';


export default function FormatNumber({value, langCode = null, decimalPlaces = null, options = null}) {
  return isNaN(value) ? <Trans id="formatNumber.isNaN">-</Trans> : formatNumber(value, decimalPlaces, langCode, options);
}

if(process.env.NODE_ENV !== 'production') {
  FormatNumber.propTypes = {
    value: PropTypes.number.isRequired,
    langCode: PropTypes.string,
    decimalPlaces: isInteger,
    options: PropTypes.object
  }
}
