import React from 'react';
import PropTypes from 'prop-types';


import formatDate from '@/helpers/format-date';


//this component is Pure
export default function FormatDate({value, langCode = null, format = null}) {
  return formatDate(value, langCode, format);
}


FormatDate.propTypes = {
  value: PropTypes.instanceOf(Date),
  langCode: PropTypes.string,
  format: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ])
};