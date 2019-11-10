import React from 'react';
import PropTypes from 'prop-types';
import {Trans} from '@lingui/macro';

import defaultStyles from './progress.scss';

//Components
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Hooks
import useI18n from '@/hooks/useI18n';

//helpers
import roundTo from '@/helpers/math/round-to';
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';
import formatNumber from '@/helpers/string/format-number';

//The component
const Progress = React.forwardRef(function Progress({styles, value, max, showValues, formatValuesDecimalPlaces, full, thin, ...rest}, ref) {
  const i18n = useI18n();

  const extendedClasses = css(full && styles.full, thin && styles.thin);

  const formattedValue = formatNumber(value, formatValuesDecimalPlaces, i18n.language);//<FormatNumber value={formatValues ? formatValues(value) : value} />
  const formattedMax = formatNumber(max, formatValuesDecimalPlaces, i18n.language);//<FormatNumber value={formatValues ? formatValues(max) : max} />

  const formattedPercent = <FormatNumber value={(value / max) * 100} decimalPlaces={2} />

  const progressProps = {
    value,
    max,
    className: css(styles.progress, showValues && styles.showValues, extendedClasses)
  };

  if(showValues) {
    progressProps['data-progress-values'] = i18n._(
      'progress.values',
      {
        value: formattedValue,
        max: formattedMax
      },
      {defaults: '{value} / {max}'}
    );
  }

  return <progress {...combineProps(progressProps, rest)} ref={ref}>
    <div className={css(styles.gauge, extendedClasses)}>
      <span
        className={css(styles.bar, extendedClasses)}
        style={{width: roundTo((value / max) * 100, 2)+'%'}}
      >
        {showValues ?
          <Trans id="progress.fallback.valuesFormat">{formattedValue} / {formattedMax} ({formattedPercent}%)</Trans>
          :
          <Trans id="progress.fallback.format">{formattedPercent}%</Trans>
        }

      </span>
    </div>
  </progress>
});

export default Progress;


Progress.defaultProps = {
  value: 0,
  max: 100,
  full: false,
  styles: defaultStyles,
  formatValuesDecimalPlaces: 0
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  full: PropTypes.bool,
};
