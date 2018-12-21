import React from 'react';
import {compose} from 'recompose';
import styles from './styles.scss';


//HOCs
import ResponsiveComponent, {makeCheckSizeWidthFunc} from '@/HOCs/ResponsiveComponent';


//Helpers
import reactOmitElementProp from '@/helpers/react-omit-element-prop';
import reactChildrenToArray from '@/helpers/react-children-to-array';


//The component
function Tabs({children, accordion = false, selectedTabIndex = 0, setSelectedTabIndex = null, getRef = null}) {
  children = reactChildrenToArray(children);
  selectedTabIndex = selectedTabIndex|0;

  if(selectedTabIndex < 0) {
    selectedTabIndex = 0;
  } else if (selectedTabIndex >= children.length) {
    selectedTabIndex = children.length - 1;
  }

  return <div className={accordion ? styles.accordion : styles.tabs} ref={getRef}>
    {!accordion && <div className={styles.tabsList} role="tablist" aria-orientation="horizontal">
      {children.map((child, index) => {
        const isSelected = index === selectedTabIndex;

        return <button key={child.key} className={isSelected ? styles.selectedTab : styles.tab} role="tab" aria-selected={isSelected} id={`${child.key}-tab`} aria-controls={`${child.key}-panel`} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
          {child.props['tab-title']}
        </button>
      })}
    </div>}
    {children.map((child, index) => {
      const isSelected = index === selectedTabIndex;
      const elements = [];

      if(accordion) {
        elements.push(<div ley={`${child.key}-header`} className={isSelected ? styles.selectedHeader : styles.header} role="heading">
          <button id={`${child.key}-tab`} className={isSelected ? styles.selectedHeaderButton : styles.headerButton} type="button" aria-controls={`${child.key}-panel`} aria-expanded={isSelected} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
            {child.props['tab-title']}
          </button>
        </div>);
      }

      elements.push(<div key={child.key} className={accordion ? (isSelected ? styles.openPanel : styles.closedPanel) : (isSelected ? styles.selectedPanel : styles.panel)} id={`${child.key}-panel`} role={accordion ? 'region' : 'tab-panel'} aria-labelledby={`${child.key}-tab`} aria-hidden={!isSelected}>
        {reactOmitElementProp(child, 'tab-title')}
      </div>);

      return elements;
    })}
  </div>
}

export default compose(
  ResponsiveComponent(
    makeCheckSizeWidthFunc('accordion')
  )
)(Tabs);

export const Display = Tabs;
