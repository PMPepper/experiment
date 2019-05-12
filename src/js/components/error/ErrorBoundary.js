import React from 'react';
import PropTypes from 'prop-types';

import {Trans} from '@lingui/macro';

import styles from './errorBoundary.scss';


function defaultMerge(ownProps, addedProps) {
  return {...ownProps, ...addedProps};
}

export default class ErrorBoundary extends React.Component {
  state = {hasError: false};

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true, error, info});
  }

  render() {
    if (this.state.hasError) {
      return this._renderError();
    }

    return this.props.children || null;
  }

  _renderError() {
    const {error, info} = this.state;
    const {getRef, style} = this.props;

    if(process.env.NODE_ENV !== 'production') {
      //Dev error boundary
      return <div className={styles.error} ref={getRef} style={style}>
        <h2 className={styles.title}><Trans id="errorboundary-title">Sorry, something went wrong</Trans></h2>
        <h3 className={styles.subTitle}><Trans id="errorboundary-error-title">Error</Trans></h3>
        <p className={styles.message}>{error.message}</p>
        <p className={styles.errorStack}>{error.stack}</p>

        <h3 className={styles.subTitle}><Trans id="errorboundary-componentStack-title">React component stack</Trans></h3>
        <p className={styles.componentStack}>{info.componentStack}</p>
      </div>
    } else {
      //Production error boundary
      return <div className={styles.error} ref={getRef} style={style}>
        <h2 className={styles.title}><Trans id="errorboundary-title">Sorry, something went wrong</Trans></h2>
        <p className={styles.errorText}>
          <Trans id="errorboundary-error-msg">Your system administrators have been notified of this error. Please contact them for further assitance. The error messages was: {error.message}</Trans>
        </p>
      </div>
    }
  }
}
