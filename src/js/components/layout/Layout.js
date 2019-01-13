import React from 'react';
import defaultStyles from './styles.scss';


import combineProps from '@/helpers/react/combine-props';
//import cloneOmittingProps from '@/helpers/react/clone-omitting-props';

import {addItem, removeItem} from '@/modules/onFrameIterator';


export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      breakpoint: this.props.breakpoints[this.props.breakpoints.length-1]
    };

    addItem(this.update);
  }

  componentWillUnmount() {
    removeItem(this.update);
  }

  update = () => {
    const ref = this._ref;

    if(ref) {
      const width = ref.offsetWidth;
      const breakpoints = this.props.breakpoints;
      let breakpoint;

      //find appropriate breakpoint
      for(let i = 0; i < breakpoints.length; ++i) {
        breakpoint = breakpoints[i];

        if(!breakpoint.max || breakpoint.max > width) {
          break;
        }
      }

      //if selected breakpoint has changed, save to state
      if(breakpoint.name !== this.state.breakpoint.name) {
        this.setState({breakpoint})
      }
    }
  }

  getRef = (ref) => {
    this.props.getRef && this.props.getRef(ref);

    this._ref = ref;
  }

  render() {
    const {component: Component, styles, children, breakpoints, ...rest} = this.props;
    const breakpointNames = breakpoints.map(breakpoint => (breakpoint.name));
    const breakpoint = this.state.breakpoint;

    const rowProps = {breakpoint, breakpointNames};

    return <Component {...combineProps({
      className: styles.layout,
      ref: this.getRef
    }, rest)}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, rowProps)
      })}
    </Component>
  }

  static defaultProps = {
    component: 'div',
    styles: defaultStyles,
    breakpoints: [
      {name: 'small', max: 700, columns: 1},
      {name: 'medium', max: 1000, columns: 3},
      {name: 'large', columns: 12}
    ]
  };
}


export {default as Row} from './Row';
export {default as Cell} from './Cell';
