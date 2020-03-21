import {useRef, useEffect} from 'react';


export default function useKeyboardState(preventDefaults) {
  const stateRef = useRef({
    keyboardState: {},
    preventDefaults: preventDefaults,

    isKeyDown: (key) => {
      if(key instanceof Array) {
        return key.some((keyCode) => (!!stateRef.current.keyboardState[keyCode]))
      } else {
        return !!stateRef.current.keyboardState[key];
      }
    },

    props: {
      onKeyDown: (e) => {
        stateRef.current.keyboardState[e.which] = true;

        stateRef.current.preventDefaults && e.preventDefault();
      },
      onKeyUp: (e) => {
        stateRef.current.keyboardState[e.which] = false;
      },
      onBlur: (e) => {
        stateRef.current.keyboardState = {};
      },
    },
    // ref: null,
    // setRef: (ref) => {
    //   if(stateRef.current.ref) {//Tidy up current event listeners
    //     stateRef.current.ref.removeEventListener('keydown', stateRef.current.onKeyDown);
    //     stateRef.current.ref.removeEventListener('keyup', stateRef.current.onKeyUp);
    //     stateRef.current.ref.removeEventListener('blur', stateRef.current.onBlur);
    //   }
    //
    //   if(ref) {//set new listeners
    //     ref.addEventListener('keydown', stateRef.current.onKeyDown);
    //     ref.addEventListener('keyup', stateRef.current.onKeyUp);
    //     ref.addEventListener('onBlur', stateRef.current.onBlur);
    //   }
    //
    //   //record ref
    //   stateRef.current.ref = ref;
    // }
  });

  //record current value of preventDefaults
  stateRef.current.preventDefaults = preventDefaults

  // useEffect(() => {
  //   return () => {//on the component unmounting
  //     if(stateRef.current.ref) {//Tidy up current event listeners
  //       stateRef.current.ref.removeEventListener('keydown', stateRef.current.onKeyDown);
  //       stateRef.current.ref.removeEventListener('keyup', stateRef.current.onKeyUp);
  //       stateRef.current.ref.removeEventListener('blur', stateRef.current.onBlur);
  //     }
  //   }
  // }, [])

  return [stateRef.current.props, stateRef.current.isKeyDown]
}
