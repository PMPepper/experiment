import {useRef} from 'react';

let uniqueId = 0;

const getUniqueId = () => uniqueId++;

export default function useId(id, prefix = 'id') {
  const idRef = useRef(prefix + getUniqueId());

  return id || idRef.current;
}
