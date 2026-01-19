import {useEffect, useRef} from 'react';

export const useItemsResizeObserver = (
  callback: (index: number, size: { width: number; height: number }) => void
) => {
  const observerRef = useRef<ResizeObserver>(null);
  const elementMap = useRef(new Map<Element, number>());

  const getObserver = (): ResizeObserver => {
    if (!observerRef.current) {
      observerRef.current = new ResizeObserver(entries => {
        for (const entry of entries) {
          const index = elementMap.current.get(entry.target);
          if (index !== undefined) {
            const width = entry.borderBoxSize[0].inlineSize;
            const height = entry.borderBoxSize[0].blockSize;
            if (width !== 0 || height !== 0) {
              callback(index, {width, height});
            }
          }
        }
      });
    }

    return observerRef.current;
  };

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const observeItem = (element: HTMLElement | null, index: number): void => {
    if (!element) {
      return;
    }
    elementMap.current.set(element, index);
    getObserver().observe(element);
  };

  const unobserveItem = (element: HTMLElement | null): void => {
    if (!element) {
      return;
    }
    elementMap.current.delete(element);
    observerRef.current?.unobserve(element);
  };

  return {observeItem, unobserveItem};
};
