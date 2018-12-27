import React from 'react';
import {compose} from 'recompose';
import styles from './styles.scss';


//HOCs
import ResponsiveComponent, {makeCheckSizeWidthFunc} from '@/HOCs/ResponsiveComponent';

//Components
//import Transition from '@/components/transitions/FadeAndVerticalSlideAnimation';


//Helpers
import reactOmitElementProp from '@/helpers/react-omit-element-prop';
import reactChildrenToArray from '@/helpers/react-children-to-array';
import css from '@/helpers/css-class-list-to-string';


//The component
function Tabs({children, accordion = false, selectedTabIndex = 0, setSelectedTabIndex = null, getRef = null}) {
  children = reactChildrenToArray(children);
  selectedTabIndex = selectedTabIndex|0;

  if(selectedTabIndex < 0) {
    selectedTabIndex = 0;
  } else if (selectedTabIndex >= children.length) {
    selectedTabIndex = children.length - 1;
  }

  const isAccordionStyle = accordion && styles.accordion;

  return <div className={css(styles.tabs, isAccordionStyle)} ref={getRef}>
    {!accordion && <div className={css(styles.tabsList, isAccordionStyle)} role="tablist" aria-orientation="horizontal">
      {children.map((child, index) => {
        const isSelected = index === selectedTabIndex;

        return <button key={child.key} className={css(styles.tab, isAccordionStyle, isSelected && styles.selected)} role="tab" aria-selected={isSelected} id={`${child.key}-tab`} aria-controls={`${child.key}-panel`} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
          {child.props['tab-title']}
        </button>
      })}
    </div>}
    <div className={css(styles.tabPanels, isAccordionStyle)}>
      {children.map((child, index) => {
        const isSelected = index === selectedTabIndex;
        const elements = [];

        if(accordion) {
          elements.push(<div key={`${child.key}-header`} className={css(styles.header, isAccordionStyle, isSelected && styles.selected)} role="heading">
            <button id={`${child.key}-tab`} className={css(styles.headerButton, isAccordionStyle, isSelected && styles.selected)} type="button" aria-controls={`${child.key}-panel`} aria-expanded={isSelected} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
              {child.props['tab-title']}
            </button>
          </div>);
        }

        elements.push(<div key={child.key} className={css(styles.panel, isAccordionStyle, isSelected && styles.selected)} id={`${child.key}-panel`} role={accordion ? 'region' : 'tab-panel'} aria-labelledby={`${child.key}-tab`} aria-hidden={!isSelected}>
          {reactOmitElementProp(child, 'tab-title')}
        </div>);

        return elements;
      })}
    </div>
  </div>
}

export default compose(
  ResponsiveComponent(
    makeCheckSizeWidthFunc('accordion')
  )
)(Tabs);

export const Display = Tabs;
