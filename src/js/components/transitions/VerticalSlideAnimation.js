import React from 'react';


//Factories
import makeAnimationSingleTransition from '@/factories/AnimationSingleTransitionFactory';


const DEFAULT_SHOW_TRANSITION = {duration: 300, easing: 'ease-in-out'};
const DEFAULT_HIDE_TRANSITION = {duration: 300, easing: 'ease-in-out', fill: 'forwards'};


export default makeAnimationSingleTransition({
  name: 'SingleVerticalSlideAnimation',
  getPreShowAnimationValues: (ref, interrupted) => {
    if(!interrupted) {
      return null;
    }

    const computed = window.getComputedStyle(ref);

    return {
      height: computed.getPropertyValue('height'),
    }
  },
  getShowAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //get total height
    const targetHeight = `${ref.clientHeight}px`;

    //Get starting values
    const startingHeight = interrupted ? preAnimationStyles.height : 0;

    //begin transition
    return ref.animate([
        {height: startingHeight},
        {height: targetHeight}
      ],
      props.showTransitionSettings || DEFAULT_SHOW_TRANSITION
    );
  },
  onShowAnimationComplete: (ref) => {
    if(ref) {
      ref.style.height = '';
    }
  },
  getPreHideAnimationValues: (ref, interrupted) => {
    if(!interrupted) {
      return null;
    }

    const computed = window.getComputedStyle(ref);

    return {
      height: computed.getPropertyValue('height'),
    };
  },
  getHideAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //Get starting values
    const startingHeight = interrupted ? preAnimationStyles.height : `${ref.clientHeight}px`;

    //begin transition
    return ref.animate([
        {height: startingHeight},
        {height: 0}
      ],
      props.hideTransitionSettings || DEFAULT_HIDE_TRANSITION
    );
  },
  onHideAnimationComplete: (ref) => {
    if(ref) {
      ref.style.height = '';//needed in case the animation was interrupted
    }
  },
})
