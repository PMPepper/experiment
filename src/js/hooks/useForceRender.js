import React, {useState, useCallback} from 'react'

//returns a function that when called will force a render
export default function useForceRender(doForceUpdate) {
  const [, setTick] = useState(0);

  return  useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
}
