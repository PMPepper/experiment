import React from 'react';
import PropTypes from 'prop-types';

import isReactComponent from '@/prop-types/is-react-component';


export default function Icon({icon, component: Component = 'i', className = null, ...rest}) {
  const classes = ['fa', `fa-${icon}`];

  if(className) {
    classes.push(className);
  }

  return <Component {...rest} className={classes.join(' ')} aria-hidden="true"></Component>
}

if(process.env.NODE_ENV !== 'production') {
  Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    component: isReactComponent,
    className: PropTypes.string,
  };
}
