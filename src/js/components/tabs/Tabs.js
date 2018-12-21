import React from 'react';
import {compose} from 'recompose';
import styles from './styles.css';


//HOCs
import ResponsiveComponent from '@/HOCs/ResponsiveComponent';


//Helpers
import reactOmitElementProp from '@/helpers/react-extract-element-prop';


//The component
function Tabs({children, accordion = false, selectedTabIndex = 0, setSelectedTabIndex = null, getRef = null}) {
  return <div class={accordion ? styles.accordion : styles.tabs} ref={getRef}>
    {!accordion && <div class={styles.tabsList} role="tablist" aria-orientation="horizontal">
      {children.map((child, index) => {
        const isSelected = index === selectedTabIndex;

        return <button key={child.key} class={isSelected ? styles.selectedTab : styles.tab} role="tab" aria-selected={isSelected} id={`${child.key}-tab`} aria-controls={`${child.key}-panel`} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
          {child.props['tab-title']}
        </button>
      })}
    </div>}
    {children.map((child, index) => {
      const isSelected = index === selectedTabIndex;
      const elements = [];

      if(accordion) {
        elements.push(<div ley={`${child.key}-header`} class={isSelected ? styles.selectedHeader : styles.header} role="heading">
          <button id={`${child.key}-tab`} class={isSelected ? styles.selectedHeaderButton : styles.headerButton} type="button" aria-controls={`${child.key}-panel`} aria-expanded={isSelected} onClick={setSelectedTabIndex ? () => {setSelectedTabIndex(index)} : null}>
            {child.props['tab-title']}
          </button>
        </div>);
      }

      elements.push(<div key={child.key} class={accordion ? (isSelected ? styles.openPanel : styles.closedPanel) : (isSelected ? styles.selectedPanel : styles.panel)} id={`${child.key}-panel`} role={accordion ? 'region' : 'tab-panel'} aria-labelledby={`${child.key}-tab`} aria-hidden={!isSelected}>
        {reactOmitElementProp(child, 'tab-title')}
      </div>);

      return elements;
    })}
  </div>
}

export default compose(
  ResponsiveComponent(
    ({outerWidth, scrollWidth}, {outerWidth: lastOuterWidth, scrollWidth: lastScrollWidth}, lastState) => {
      //console.log(outerWidth, scrollWidth, lastOuterWidth, lastScrollWidth, lastState);
      if(outerWidth === lastOuterWidth && scrollWidth === lastScrollWidth) {
        //console.log('keep using previous');
        return lastState;//If width of the component hasn't changed, retain current mode
      }

      if(scrollWidth > outerWidth) {
        //console.log('use alternative');
        return {accordion: true};
      } else if(lastScrollWidth > lastOuterWidth && outerWidth === lastOuterWidth) {
        //console.log('keep using alternative', outerWidth, scrollWidth, lastState);
        return {accordion: true};//had to switch to responsive component because regular one didn't fit
      }

      return {accordion: false};
    }
  )
)(Tabs);

export const Display = Tabs;
