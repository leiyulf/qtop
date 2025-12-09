import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
// const [boxRef, { width: boxWidth, height: boxHeight }, updateSize] = useElementSize();

const useElementSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);

  const updateSize = useCallback(() => {
    if (elementRef.current) {
      setSize({
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight,
      });
    }
  }, []);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);

    let observer;
    if (elementRef.current) {
      observer = new ResizeObserver(updateSize);
      observer.observe(elementRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [updateSize]);

  return [elementRef, size, updateSize];
};

export default useElementSize;
