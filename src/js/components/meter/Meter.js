import React from 'react';
import PropTypes from 'prop-types';
import {Trans} from '@lingui/macro';

import defaultStyles from './meter.scss';

//Components
import FormatNumber from '@/components/formatNumber/FormatNumber';

//Helpers
import roundTo from '@/helpers/math/round-to';
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';

//Other
import {COLOURS} from '@/vars/Consts';


//The component
export default function Meter({styles, value, max, min, full, colour, task, getRef, ...rest}) {
  const extendedClasses = css(full && styles.full, colour && styles[`colour_${colour}`]);

  const formattedValue = <FormatNumber value={(value / max) * 100} decimalPlaces={2} />

  return <meter {...combineProps({ref: getRef, value, min, max, className: css(styles.meter, extendedClasses)}, rest)}>
    <div className={css(styles.gauge, extendedClasses)}>
      <span
        className={css(styles.bar, extendedClasses)}
        style={{width: roundTo((value / max) * 100, 2)+'%'}}
      >
        <Trans id="meter.fallbackFormat">{formattedValue}%</Trans>
      </span>
    </div>
  </meter>
};

Meter.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number,
  full: PropTypes.bool,
  colour: PropTypes.oneOf(COLOURS),
}

Meter.defaultProps = {
  styles: defaultStyles,
  getRef: null,
  min: 0,
  full: null,
  colour: null,
};
