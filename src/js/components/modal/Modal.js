import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Trans} from '@lingui/macro';

import defaultStyles from './styles.scss';

import ErrorBoundary from '@/components/error/ErrorBoundary';
import FadeAnimation from '@/components/transitions/FadeAnimation';

import getFocusableElements from '@/helpers/dom/get-focusable-elements';
import combineProps from '@/helpers/react/combine-props';
import css from '@/helpers/css/class-list-to-string';
import isDOMComponent from '@/helpers/react/is-dom-component';

import isReactRenderable from '@/prop-types/is-react-renderable';


export default class Modal extends React.Component {

  _setRef = (ref) => {
    this.props.getRef && this.props.getRef(ref);

    this._ref = ref;
  }

  _onFocus = (e) => {
    const focusable = getFocusableElements(this._ref);

    if(focusable[0] === e.target) {
      focusable[focusable.length-2].focus();
    }

    if(focusable[focusable.length-1] === e.target) {
      focusable[1].focus();
    }
  }

  _onKeyDown = (e) => {
    if(this.props.escCloses && e.which == 27) {
      this.props.onRequestClose(e);
    }
  }

  render() {
    const {isOpen, bg, mode, size, styles, title, contentLabel, onRequestClose, onClosed, children, clickOutsideCloses, hasCloseBtn} = this.props;

    const modifierClasses = css(bg && styles[`bg-${bg}`], mode && styles[`mode-${mode}`], size && styles[`size-${size}`]);

    return ReactDOM.createPortal(
      <FadeAnimation onChangeAnimationState={onClosed ? (to, from) => {to === 0 && onClosed();} : null}>
        {isOpen && <article
          ref={this._setRef}
          aria-modal="true"
          aria-label={contentLabel ? contentLabel : null}
          className={css(styles.modal, modifierClasses)}
          tabIndex="0"
          onFocus={this._onFocus}
          onKeyDown={this._onKeyDown}
        >
          <span tabIndex="0" className="offscreen"></span>
          <div className={css(styles.overlay, modifierClasses)} onClick={clickOutsideCloses ? onRequestClose : null}></div>
          <section
            className={css(styles.content, modifierClasses)}
            role={mode === 'error' ? 'alertdialog' : 'dialog'}
          >
            <header className={css(styles.header, modifierClasses)}>
              {mode === 'success' && <i className={css(styles.icon, modifierClasses, 'fa fa-check-circle-o')} aria-hidden="true"></i>}
              {mode === 'info' && <i className={css(styles.icon, modifierClasses, 'fa fa-info-circle')} aria-hidden="true"></i>}
              {(mode === 'error' || mode === 'warning') && <i className={css(styles.icon, modifierClasses, 'fa fa-exclamation-triangle')} aria-hidden="true"></i>}

              <h2 className={css(styles.title, modifierClasses)}>{title || contentLabel}</h2>
              {hasCloseBtn && onRequestClose && <button type="button" className={css(styles.closeBtn, modifierClasses)} onClick={onRequestClose}>
                <i className={css(styles.closeBtnIcon, modifierClasses, 'fa fa-times')} aria-hidden="true"></i>
                <span className="offscreen"><Trans id="modal-close">Close</Trans></span>
              </button>}
            </header>
            <div className={css(styles.body, modifierClasses)}>
              <ErrorBoundary>
                <CloseModalContext.Provider value={onRequestClose}>
                  {children}
                </CloseModalContext.Provider>
              </ErrorBoundary>
            </div>
          </section>
          <span tabIndex="0" className="offscreen"></span>{/*This is used for focus management*/}
        </article>}
      </FadeAnimation>,
      document.body,//DEV make this in some way configurable? Not when YAGNI.
    );
  }

  static defaultProps = {
    styles: defaultStyles,

    isOpen: false,

    mode: null,//one of: error, warning, success, info or nuffin'
    size: null,//one of: thin, lessThin, wide or nuffin'
    bg: null, //dark or nuffin'

    escCloses: true,
    hasCloseBtn: true,
    clickOutsideCloses: false,
  }

  static propTypes = {
    isOpen: PropTypes.bool,
    title: isReactRenderable,
    contentLabel: PropTypes.string,
    bg: PropTypes.oneOf(['dark']),
    mode: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    size: PropTypes.oneOf(['thin', 'lessThin', 'wide']),
    onRequestClose: PropTypes.func,
    onClosed: PropTypes.func,

    clickOutsideCloses: PropTypes.bool,
    hasCloseBtn: PropTypes.bool,
  }
}

Modal.Content = ({component: Component = 'div', styles = defaultStyles, children, noPad, getRef, ...rest}) => {
  return <Component {...combineProps({className: css(styles.panel, noPad && styles.noPad), [isDOMComponent(Component) ? 'ref' : 'getRef']: getRef}, rest)}>{children}</Component>
}

//Context
export const CloseModalContext = React.createContext(null);
