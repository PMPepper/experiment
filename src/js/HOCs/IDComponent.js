//
import React from 'react';
import {getDisplayName} from 'recompose';


export default function({
  prefix = '_',
  mapProps = (props, id) => ({...props, id}),
} = {}) {
  return (PresentationalComponent) => {
    return class extends React.Component {
      static displayName = `IDComponent(${getDisplayName(PresentationalComponent)})`;

      constructor(props) {
        super(props);

        this.id = props.id || (prefix + Math.floor(Math.random()*100000)+'_'+(idCounter++))
      }

      render() {
        return <PresentationalComponent {...mapProps(this.props, this.id)} />
      }
    };
  }
}

let idCounter = 1;
