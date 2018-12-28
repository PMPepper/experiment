import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import styles from './styles.scss';

//HOCs
import ResponsiveComponent, {makeCheckSizeWidthFunc} from '@/HOCs/ResponsiveComponent';

//Components

//Helpers
import reactOmitElementProp from '@/helpers/react-omit-element-prop';
import reactChildrenToArray from '@/helpers/react-children-to-array';
import css from '@/helpers/css-class-list-to-string';

//Custom prop types
import isPositiveInteger from '@/prop-types/is-positive-integer';

//The component
class Tabs extends React.Component {
  _lastSelectedTabIndex = null;
  _lastAccordion = null;
  _panelElements = {};

  _registerPanel = (ref, index) => {
    const oldPanel = this._panelElements[index];

    //clear old listeners
    if(oldPanel) {
      oldPanel.removeEventListener('transitionend', this._clearHeight);
    }

    //record new panel
    this._panelElements[index] = ref;

    //add event listener
    if(ref) {
      ref.addEventListener('transitionend', this._clearHeight);
    }
  }

  _clearHeight = (e) => {
    if(e.propertyName === 'height') {
      e.target.height = null;
    }
  }

  _cleaAllHeights = (e) => {
    Object.values(this._panelElements).forEach(panel => {
      panel && (panel.style.height = null);
    })
  }

  componentWillUnmount() {
    //tidy up event listeners
    Object.values(this._panelElements).forEach(panel => {
      panel && panel.removeEventListener('transitionend', this._clearHeight);
    })
  }

  render() {
    let {children, accordion = false, selectedTabIndex = 0, setSelectedTabIndex = null, getRef = null} = this.props;

    children = reactChildrenToArray(children);
    selectedTabIndex = selectedTabIndex|0;

    //limit to within allowed range
    if(selectedTabIndex < 0) {
      selectedTabIndex = 0;
    } else if (selectedTabIndex >= children.length) {
      selectedTabIndex = children.length - 1;
    }

    if(selectedTabIndex !== this._lastSelectedTabIndex) {
      if(this._lastSelectedTabIndex !== null) {//tab index has changed
        if(accordion) {
          //begin accordion transitions
          const newSelectedPanel = this._panelElements[selectedTabIndex];
          const oldSelectedPanel = this._panelElements[this._lastSelectedTabIndex];

          //record/set element heights
          newSelectedPanel && (newSelectedPanel.style.height = `${newSelectedPanel.scrollHeight + (newSelectedPanel.offsetHeight - newSelectedPanel.clientHeight)}px`);
          oldSelectedPanel && (oldSelectedPanel.style.height = `${oldSelectedPanel.scrollHeight + (oldSelectedPanel.offsetHeight - oldSelectedPanel.clientHeight)}px`);

          //clear height the moment the transition has started (is enough to trigger from/to values for the old panel)
          setTimeout(() => {oldSelectedPanel.style.height = null}, 0);

          //-all panels have transitionend handler for height to auto-clear values
        }
      }

      //record selected tab index
      this._lastSelectedTabIndex = selectedTabIndex;
    }

    //if accordion prop changes
    if(accordion !== this._lastAccordion) {
      this._cleaAllHeights();

      this._lastAccordion = accordion;
    }

    const isAccordionStyle = accordion && styles.accordion;

    //actually do the rendering
    return <div className={css(styles.tabs, isAccordionStyle)} ref={getRef}>
      {/*tabsList*/}
      {!accordion && <div className={css(styles.tabsList, isAccordionStyle)} role="tablist" aria-orientation="horizontal">
        {children.map((child, index) => {
          const isSelected = index === selectedTabIndex;

          //tabs
          return <button key={child.key} className={css(styles.tab, isAccordionStyle, isSelected && styles.selected)} role="tab" aria-selected={isSelected} id={`${child.key}-tab`} aria-controls={`${child.key}-panel`} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
            {child.props['tab-title']}
          </button>
        })}
      </div>}

      {/*tabPanels*/}
      <div className={css(styles.tabPanels, isAccordionStyle)}>
        {children.map((child, index) => {
          const isSelected = index === selectedTabIndex;
          const elements = [];

          //headers
          elements.push(<div key={`${child.key}-header`} className={css(styles.header, isAccordionStyle, isSelected && styles.selected)} role="heading">
            <button id={`${child.key}-tab`} className={css(styles.headerButton, isAccordionStyle, isSelected && styles.selected)} type="button" aria-controls={`${child.key}-panel`} aria-expanded={isSelected} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
              {child.props['tab-title']}
            </button>
          </div>);

          //panels
          elements.push(
            <div
              key={child.key}
              className={css(styles.panel, isAccordionStyle, isSelected && styles.selected)}
              id={`${child.key}-panel`}
              role={accordion ? 'region' : 'tab-panel'}
              aria-labelledby={`${child.key}-tab`}
              aria-hidden={!isSelected}
              inert={isSelected ? null: 'inert'}
              ref={(ref) => {this._registerPanel(ref, index)}}
            >
              {reactOmitElementProp(child, 'tab-title')}
            </div>
          );

          return elements;
        })}
      </div>
    </div>
  }
}

if(process.env.NODE_ENV !== 'production') {
  Tabs.propTypes = {
    accordion: PropTypes.bool,
    selectedTabIndex: isPositiveInteger,
    setSelectedTabIndex: PropTypes.func,
    getRef: PropTypes.func
  };
}

export default compose(
  ResponsiveComponent(
    makeCheckSizeWidthFunc('accordion')
  )
)(Tabs);

export const Display = Tabs;
