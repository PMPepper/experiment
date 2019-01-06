import React from 'react';
import {getDisplayName} from 'recompose';

//helpers
import combineProps from '@/helpers/react/combine-props';


//The HOC
export default function({
  preventActiveKeyDefaults = true,
  defaultActiveKeys = null,
  mapProps = (props, componentProps) => {
    return combineProps(componentProps, props);
  }
} = {}) {
  return (PresentationalComponent) => {
    return class KeyboardControlsComponent extends React.Component {
      keysDown = {};
      activeKeys = null;

      constructor(props) {
        super(props);

        this.componentProps = {
          onKeyDown: this.onKeyDown,
          onKeyUp: this.onKeyUp,
          onBlur: this.onBlur,
          tabIndex: 0,

          isKeyDown: this.isKeyDown,
          setActiveKeys: this.setActiveKeys,
        };

        this.setActiveKeys(defaultActiveKeys);
      }

      //react lifecycle methods
      render() {
        return <PresentationalComponent {...mapProps(this.props, this.componentProps)} />
      }

      componentWillUnmount() {
        this._endDragging();
      }

      //public methods
      isKeyDown = (key) => {
        if(!key) {
          throw new Error('please supply a key to check if it is down');
        }

        if(key instanceof Array) {
          return key.some((keyCode) => (!!this.keysDown[keyCode]))
        } else {
          return !!this.keysDown[key];
        }
      }

      //takes array of key codes, or null
      setActiveKeys = (activeKeys) => {
        this.activeKeys = (activeKeys instanceof Array) ? activeKeys.reduce((obj, k) => {obj[k] = true; return obj;}, {}) : null ;
      }

      //Event handlers
      onKeyDown = (e) => {
        //console.log(e.which);

        if(this.activeKeys && !this.activeKeys[e.which]) {
          return;
        }

        this.keysDown[e.which] = true;

        //Keys which do something have their default actions cancelled
        preventActiveKeyDefaults && e.preventDefault();
      }

      onKeyUp = (e) => {
        if(this.activeKeys && !this.activeKeys[e.which]) {
          return;
        }

        this.keysDown[e.which] = false;
      }

      onBlur = () => {
        this.keysDown = {};
      }

      displayName = `KeyboardControlsComponent(${getDisplayName(PresentationalComponent)})`
    };
  }
}
