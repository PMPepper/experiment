import React from 'react';

import ContentMenu from './ContextMenu';
//import combineProps from '@/helpers/react/combine-props';

const defaultState = {
  isOpen: false,
  items: null,
  position: {x: 0, y: 0}
};


//The component
export default class AddContextMenu extends React.Component {
  state = defaultState;

  _child = null;



  constructor(props) {
    super(props);

    this._childProps = {
      onContextMenu: this._onContextMenu,
      key: 'item',
      'aria-haspopup': true
    }
  }

  _onContextMenu = (e, ...args) => {
    this._child && this._child.props.onContextMenu && this._child.props.onContextMenu(e);

    if(this.state.isOpen) {
      return;
    }

    const items = this.props.getItems ? this.props.getItems(e, ...args) : null;

    if(items && items.length > 0) {
      this.setState({
        isOpen: true,
        items,
        position: {x: e.clientX, y: e.clientY}
      });

      e.preventDefault();
      e.stopPropagation();
    }
  }

  _onRequestClose = () => {
    if(this.state.isOpen) {
      this.setState(defaultState);
    }
  }

  render() {
    const {children, getItems} = this.props;
    const state = this.state;

    const child = React.Children.only(children);

    this._child = child;

    return [
      React.cloneElement(
        child,
        this._childProps
      ),
      state.isOpen && <ContentMenu key="contextMenu" items={state.items} position={state.position} doRequestClose={this._onRequestClose} />
    ];
  }
}
