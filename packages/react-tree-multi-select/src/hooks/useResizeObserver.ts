import {useEffect} from 'react';

export const useResizeObserver = (
  element: Element | null,
  callback: (size: { width: number; height: number }) => void
): void => {
  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const boxSize = entry.borderBoxSize?.[0];
        if (boxSize) {
          callback({width: boxSize.inlineSize, height: boxSize.blockSize});
        } else {
          // Fallback
          callback({width: entry.target.clientWidth, height: entry.target.clientHeight});
        }
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, callback]);
};
