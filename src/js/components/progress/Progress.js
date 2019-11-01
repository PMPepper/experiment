import React from 'react';
import PropTypes from 'prop-types';
import {Trans} from '@lingui/macro';

import defaultStyles from './progress.scss';

//Components
import FormatNumber from '@/components/formatNumber/FormatNumber';

//helpers
import roundTo from '@/helpers/math/round-to';
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';

//The component
const Progress = React.forwardRef(function Progress({styles, value, max, colour, full, ...rest}, ref) {
  const extendedClasses = css(full && styles.full);

  const formattedValue = <FormatNumber value={(value / max) * 100} decimalPlaces={2} />

  return <progress {...combineProps({value, max, className: css(styles.progress, extendedClasses)}, rest)} ref={ref}>
    <div className={css(styles.gauge, extendedClasses)}>
      <span
        className={css(styles.bar, extendedClasses)}
        style={{width: roundTo((value / max) * 100, 2)+'%'}}
      >
        <Trans id="progress.fallback.format">{formattedValue}%</Trans>
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
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  full: PropTypes.bool,
};
