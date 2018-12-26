import React from 'react';

import makeAnimationSingleTransition from '@/factories/AnimationSingleTransitionFactory';

const DEFAULT_SHOW_TRANSITION = {duration: 300, easing: 'ease-in-out'};
const DEFAULT_HIDE_TRANSITION = {duration: 300, easing: 'ease-in-out', fill: 'forwards'};

export default makeAnimationSingleTransition({
  name: 'SingleFadeAnimation',
  getPreShowAnimationValues: (ref, interrupted) => {
    if(!interrupted) {
      return null;
    }

    const computed = window.getComputedStyle(ref);

    return {
      opacity: computed.getPropertyValue('opacity'),
    }
  },
  getShowAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //begin transition
    return ref.animate([
        {opacity: interrupted ? preAnimationStyles.opacity : 0},
        {opacity: 1}
      ],
      props.showTransitionSettings || DEFAULT_SHOW_TRANSITION
    );
  },
  getPreHideAnimationValues: (ref, interrupted) => {
    if(!interrupted) {
      return null;
    }

    const computed = window.getComputedStyle(ref);

    return {
      opacity: computed.getPropertyValue('opacity'),
    };
  },
  getHideAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //get current height
    const currentHeight = ref.clientHeight;

    //begin transition
    return ref.animate([
        {opacity: interrupted ? preAnimationStyles.opacity : 1},
        {opacity: 0}
      ],
      props.hideTransitionSettings || DEFAULT_HIDE_TRANSITION
    );
  }
})
