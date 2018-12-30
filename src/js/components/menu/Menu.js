import React from 'react';
import PropTypes from 'prop-types';

import defaultStyles from './styles.scss';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import modify from '@/helpers/object/modify';

//Others
import isReactRenderable from '@/prop-types/is-react-renderable';
import isValue from '@/prop-types/is-value';


//Consts
export const SPACER = 'spacer';


export default class Menu extends React.Component {
  state = {
    itemElements: {}
  };

  _itemRef = (element, index) => {
    if(element && element !== this.state.itemElements[index]) {
      this.setState(modify(this.state, ['itemElements', index], element))
    }
  }

  render() {
    const props = this.props;
    const {
      styles,
      items,
      level = 0, selectedItems = [],
      setSelectedItem = null, openSelectedItem = null,
      closeCurrentLevel = null, doRequestClose = null,
      subMenuComponent: SubMenuComponent = null,
      getRef,
      ...rest
    } = props;

    let selectedItemIndex = selectedItems[level];

    if(selectedItemIndex === -1) {//-1 means select the first selectable item
      selectedItemIndex = items.findIndex(isItemSelectable);

      if(selectedItemIndex === -1) {
        selectedItemIndex = null;
      }
    }

    return <div
      {...rest}
      ref={getRef}
      className={css(styles.menu, rest.className)}
    >
      <ul className={styles.list}>
        {items.map((item, index) => {
          if(item === SPACER) {
            return <li key={index} className={styles.spacer}></li>
          }

          const hasChildren = item.items && item.items.length > 0;
          const isSelectedItem = selectedItemIndex === index;
          const isSelectableItem = isItemSelectable(item);
          const showChildren = hasChildren && isSelectedItem && selectedItems.length > level+1;
          const hasClickHandler = item.action && !hasChildren;
          const Component = hasClickHandler ? 'button' : 'div';

          const extraClasses = css(
            hasChildren && styles.hasChildren,
            showChildren && styles.showChildren,
            isSelectableItem && styles.selectable,
            isSelectedItem && styles.selected,
            item.disabled && styles.disabled,
            hasClickHandler && styles.btn
          );

          return <li
            className={css(styles.item, extraClasses)}
            key={index}
            onMouseEnter={(!item.disabled && setSelectedItem) ? () => {
              !isSelectedItem && setSelectedItem(index, level, hasChildren);
            } : null}
            onMouseOver={(!item.disabled && setSelectedItem) ? () => {
              !isSelectedItem && setSelectedItem(index, level, hasChildren);
            } : null}
            onMouseLeave={(!item.disabled && setSelectedItem) ? (e) => {
              e.stopPropagation();
              //debugger;
              isSelectedItem && setSelectedItem(null, level, true);
            } : null}
            ref={(ref) => {this._itemRef(ref, index)}}
          >
            <Component
              className={css(styles.action, extraClasses)}
              onClick={hasClickHandler && !item.disabled ? (e) => {
                item.action();
                e.preventDefault();
                props.doRequestClose && props.doRequestClose(e);
              } : null}
            >
              <span className={css(styles.icon, extraClasses)}>{item.icon}</span>
              <span className={css(styles.label, extraClasses)}>{item.label}</span>
              <span className={css(styles.info, extraClasses)}>{item.info}</span>
            </Component>

            {showChildren && SubMenuComponent && <SubMenuComponent {...props} getRef={null} level={props.level + 1} items={item.items} element={this.state.itemElements[index]} />}
          </li>
        })}
      </ul>
    </div>
  }
}

Menu.defaultProps = {
  styles: defaultStyles,
  level: 0
};


const spacerPropType = isValue(SPACER);

if(process.env.NODE_ENV !== 'production') {
  //Prop types
  const itemPropType = PropTypes.shape({
    label: isReactRenderable.isRequired,
    info: isReactRenderable,
    icon: isReactRenderable,
    disabled: PropTypes.bool,
    action: PropTypes.func,
    //items: PropTypes.array//could implement proper recursive checking, but doesn't seem essential: https://stackoverflow.com/questions/32063297/can-a-react-prop-type-be-defined-recursively
  });

  Menu.propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([
      itemPropType,
      spacerPropType
    ]))
  };
}


//Helpers
export function isItemSelectable(item) {
  return item !== SPACER && !item.disabled && (item.action || item.items && item.items.length > 0)
}
