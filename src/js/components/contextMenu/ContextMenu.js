import React from 'react';
import {compose} from 'recompose';

//HOCs
import PositionedItemComponent from '@/HOCs/PositionedItemComponent';
import MonitorElementSizeComponent from '@/HOCs/MonitorElementSizeComponent';
import FocusOnMountComponent from '@/HOCs/FocusOnMountComponent';
import WindowBoundsComponent from '@/HOCs/WindowBoundsComponent';

//Presentational
import Menu, {SPACER, isItemSelectable} from '@/components/menu/Menu';
import SubContextMenu from './SubContextMenu';

//Helpers
import combineProps from '@/helpers/react/combine-props';

//TODO close context menu:
//-if alt is pressed (what about Macs?) < alt is done
//-clicking on window scrollbar


//The component
export default compose(
  WindowBoundsComponent(),
  PositionedItemComponent(),
  MonitorElementSizeComponent(),
  FocusOnMountComponent({
    returnFocusOnUnmount: true
  })
)(class ContentMenu extends React.Component {
  state = {
    selectedItems: [null]
  };

  _ref = null;

  constructor(props) {
    super(props);

    //set listeners on the window (mousewheel etc)
    window.addEventListener('wheel', this._onWheel)
  }

  componentWillUnmount() {
    //tidy up listeners
    window.removeEventListener('wheel', this._onWheel)
  }

  setSelectedItem = (selectedItemIndex, level, openChild = false) => {
    const selectedItems = this.state.selectedItems;

    const newSelectedItems = openChild ? //TODO only if valid?
      [...selectedItems.slice(0, level), selectedItemIndex, null]
      :
      [...selectedItems.slice(0, level), selectedItemIndex];

    const indexOfNull = newSelectedItems.indexOf(null);

    if(indexOfNull !== -1 && ((indexOfNull + 1) < newSelectedItems.length)) {
      newSelectedItems.length = indexOfNull + 1;
    }

    this.setState({
      selectedItems: newSelectedItems
    });
  }

  closeCurrentLevel = () => {
    const selectedItems = this.state.selectedItems;

    this.setState({
      selectedItems: selectedItems.length > 1 ? [...selectedItems.slice(0, -1)] : selectedItems
    });
  }

  openSelectedItem = (selectFirstItem = false) => {
    const selectedItems = this.state.selectedItems;

    this.setState({
      selectedItems: [...selectedItems, selectFirstItem ? -1 : null]
    });
  }

  //Internal methods
  _onWheel = (e) => {
    //wheel event originated outside of this element, so close
    this.doRequestClose(e);
  }

  _onKeyDown = (e) => {//Take keyboard input
    const props = this.props;
    const selectedItems = this.state.selectedItems;
    const activeLevel = selectedItems.length - 1;
    let activeItems = props.items;

    for(let i = 0; i < activeLevel; i++) {
      activeItems = activeItems[selectedItems[i] || 0].items;
    }

    const selectableItemIndexes = activeItems.reduce((arr, item, index) => {
      if(isItemSelectable(item)) {
        arr.push(index);
      }

      return arr;
    }, []);

    const selectedSelectableItemIndex = selectedItems[activeLevel] === null ?
      null
      :
      selectedItems[activeLevel] === -1 ?
        (selectableItemIndexes.length > 0 ? selectableItemIndexes[0] : null)
        :
        selectableItemIndexes.findIndex(value => (value === selectedItems[activeLevel]));

    const numSelectableItems = selectableItemIndexes.length;
    const selectedItem = activeItems[selectableItemIndexes[selectedSelectableItemIndex]];
    const selectedItemHasChildren = selectedItem ?
      !selectedItem.disabled && selectedItem.items && selectedItem.items.length > 0
      :
      false;

    switch(e.which) {
      case 37://left
        if(activeLevel != 0) {//Close (if you're not level 0)
          this.closeCurrentLevel();
        }
        break;
      case 38://up
        let newIndex = selectedSelectableItemIndex === null ? numSelectableItems - 1 : (selectedSelectableItemIndex-1);

        if(newIndex < 0) {
          newIndex = numSelectableItems - 1;
        }

        this.setSelectedItem(selectableItemIndexes[newIndex], activeLevel);
        break;
      case 39://right
        if(selectedItemHasChildren) {
          this.openSelectedItem(true);
        }
        break;
      case 40://down
        this.setSelectedItem(selectableItemIndexes[selectedSelectableItemIndex === null ? 0 : (selectedSelectableItemIndex+1) % numSelectableItems], activeLevel);
        break;
      case 18://alt
      case 27://esc
        this.doRequestClose(e);
        break;
      case 9://TAB
        break;
      case 13:
        if(selectedItem) {
          if(selectedItemHasChildren) {
            this.openSelectedItem(true);
          } else if(selectedItem.action) {
            selectedItem.action();
            this.doRequestClose(e);
          }
        }
        break;
      default:
        return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  doRequestClose = (e) => {
    this.props.doRequestClose && this.props.doRequestClose(e);
  }

  _getRef = (ref) => {
    this.props.getRef && this.props.getRef(ref);

    if(this._ref && ref !== this._ref) {
      this._ref.removeEventListener('wheel', this._onMyWheel);
    }

    if(ref && ref !== this._ref) {
      ref.addEventListener('wheel', this._onMyWheel);
    }

    this._ref = ref;
  }

  _onMyWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const props = this.props;

    return <Menu
      tabIndex="0"
      {...this.props}
      getRef={this._getRef}
      selectedItems={this.state.selectedItems}
      setSelectedItem={this.setSelectedItem}
      closeCurrentLevel={this.closeCurrentLevel}
      openSelectedItem={this.openSelectedItem}
      onBlur={(e) => {
        this.props.onBlur && this.props.onBlur(e);

        //ignore blurs where the focus is going into a child element
        if(e.currentTarget.contains(e.relatedTarget)) {
          e.stopPropagation();
          return;
        }

        this.doRequestClose(e);
      }}
      onKeyDown={this._onKeyDown}
      subMenuComponent={SubContextMenu}

      onContextMenu={preventDefaultAndStopPropagation}
    />
  }
})

function preventDefaultAndStopPropagation(e) {
  e.preventDefault();
  e.stopPropagation();
}
