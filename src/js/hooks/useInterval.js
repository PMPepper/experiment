import React, {useEffect, useRef} from 'react';

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  savedCallback.current = callback;

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      //actually start interval - uses closure so if callback changes, new method will be called
      let id = setInterval(() => {savedCallback.current()}, delay * 1000);

      //returns clean-up method
      return () => {clearInterval(id);}
    }
  }, [delay]);
}
