import React from 'react';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//Import icons and build library
import {faChevronLeft, faChevronRight, faEllipsisH, faGlobe} from '@fortawesome/free-solid-svg-icons'

library.add(faChevronLeft, faChevronRight, faEllipsisH, faGlobe)


export default FontAwesomeIcon;


/*
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
}*/
