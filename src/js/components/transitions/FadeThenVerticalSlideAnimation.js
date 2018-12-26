import React from 'react';


//Factories
import makeAnimationSingleTransition from '@/factories/AnimationSingleTransitionFactory';


const DEFAULT_SHOW_TRANSITION = {duration: 300, easing: 'ease-in-out'};
const DEFAULT_HIDE_TRANSITION = {duration: 300, easing: 'ease-in-out', fill: 'forwards'};


export default makeAnimationSingleTransition({
  name: 'SingleFadeThenVerticalSlideAnimation',
  getPreShowAnimationValues: (ref, interrupted) => {
    if(!interrupted) {
      return null;
    }

    const computed = window.getComputedStyle(ref);

    return {
      height: computed.getPropertyValue('height'),
      opacity: computed.getPropertyValue('opacity'),
    }
  },
  getShowAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //get total height
    const targetHeight = `${ref.clientHeight}px`;

    //Get starting values
    const startingHeight = interrupted ? preAnimationStyles.height : 0;
    const startingOpacity = interrupted ? preAnimationStyles.opacity : 0;

    //height > opacity
    //-if no height transition needed, just transition opacity
    const keyframes = startingHeight === targetHeight ?
      [
        {opacity: startingOpacity},
        {opacity: 1}
      ]
      :
      [
        {height: startingHeight, opacity: startingOpacity},
        {height: targetHeight, opacity: startingOpacity},
        {height: targetHeight, opacity: 1}
      ]

    //begin transition
    return ref.animate(
      keyframes,
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
    };
  },
  getHideAnimation: (ref, props, interrupted, preAnimationStyles) => {
    //Get starting values
    const startingHeight = interrupted ? preAnimationStyles.height : `${ref.clientHeight}px`;
    const startingOpacity = interrupted ? preAnimationStyles.opacity : 1;

    //opacity > height
    //-if no opacity transition needed, just transition height
    const keyframes = startingOpacity === '0' ?
      [
        {height: startingHeight, opacity: 0},
        {height: 0, opacity: 0}
      ]
      :
      [
        {height: startingHeight, opacity: startingOpacity},
        {height: startingHeight, opacity: 0},
        {height: 0, opacity: 0}
      ]

    //begin transition
    return ref.animate(keyframes,
      props.hideTransitionSettings || DEFAULT_HIDE_TRANSITION
    );
  },
  onHideAnimationComplete: (ref) => {
    if(ref) {
      ref.style.height = '';//needed in case the animation was interrupted
    }
  },
})
