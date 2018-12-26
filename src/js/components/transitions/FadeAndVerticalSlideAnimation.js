import React from 'react';


//Factories
import makeAnimationSingleTransition from '@/factories/AnimationSingleTransitionFactory';


const DEFAULT_SHOW_TRANSITION = {duration: 300, easing: 'ease-in-out'};
const DEFAULT_HIDE_TRANSITION = {duration: 300, easing: 'ease-in-out', fill: 'forwards'};


export default makeAnimationSingleTransition({
  name: 'SingleFadeAndVerticalSlideAnimation',
  getPreShowAnimationValues: (ref, interrupted) => {
    if(!interrupted) {
      return null;
    }

    const computed = window.getComputedStyle(ref);

    return {
      height: computed.getPropertyValue('height'),
      opacity: computed.getPropertyValue('opacity'),
      paddingTop: computed.getPropertyValue('padding-top'),
      paddingBottom: computed.getPropertyValue('padding-bottom'),
    }
  },
  getShowAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //get target values
    const computed = window.getComputedStyle(ref);
    const targetHeight = `${ref.clientHeight}px`;
    const targetPaddingTop = computed.getPropertyValue('padding-top');
    const targetPaddingBottom = computed.getPropertyValue('padding-bottom');

    //Get starting values
    const startingHeight = interrupted ? preAnimationStyles.height : 0;
    const startingOpacity = interrupted ? preAnimationStyles.opacity : 0;
    const startingPaddingTop = interrupted ? preAnimationStyles.paddingTop : 0;
    const startingPaddingBottom = interrupted ? preAnimationStyles.paddingBottom : 0;

    //begin transition
    return ref.animate([
        {height: startingHeight, opacity: startingOpacity, paddingTop: startingPaddingTop, paddingBottom: startingPaddingBottom},
        {height: targetHeight, opacity: 1, paddingTop: targetPaddingTop, paddingBottom: targetPaddingBottom}
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
      opacity: computed.getPropertyValue('opacity'),
      paddingTop: computed.getPropertyValue('padding-top'),
      paddingBottom: computed.getPropertyValue('padding-bottom'),
    };
  },
  getHideAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //Get starting values
    const computed = interrupted ? null : window.getComputedStyle(ref);

    const startingHeight = interrupted ? preAnimationStyles.height : `${ref.clientHeight}px`;
    const startingOpacity = interrupted ? preAnimationStyles.opacity : 1;
    const startingPaddingTop = interrupted ? preAnimationStyles.paddingTop : computed.getPropertyValue('padding-top');
    const startingPaddingBottom = interrupted ? preAnimationStyles.paddingBottom : computed.getPropertyValue('padding-bottom');

    //begin transition
    return ref.animate([
        {height: startingHeight, opacity: startingOpacity, paddingTop: startingPaddingTop, paddingBottom: startingPaddingBottom},
        {height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0}
      ],
      props.hideTransitionSettings || DEFAULT_HIDE_TRANSITION
    );
  },
  onHideAnimationComplete: (ref) => {
    if(ref) {
      ref.style.height = '';//needed in case the animation was interrupted
    }
  }
})
