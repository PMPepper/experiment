import {useState, useEffect} from 'react';

function getWindowDimensions() {
  const {innerWidth: width, innerHeight: height} = window;

  const doc = document.documentElement;
  const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

  return {
    x: left,
    y: top,
    left,
    right: width + left,
    top,
    bottom: height + top,
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    }
  }, []);

  return windowDimensions;
}
