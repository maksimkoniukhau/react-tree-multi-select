import {useEffect, useRef} from 'react';

export const useItemsResizeObserver = (
  callback: (index: number, size: { width: number; height: number }) => void
) => {
  const observerRef = useRef<ResizeObserver>(null);
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

  const elementMap = useRef(new Map<Element, number>());

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const observeItem = (element: HTMLElement | null, index: number): void => {
    if (!element || !observerRef.current) {
      return;
    }
    elementMap.current.set(element, index);
    observerRef.current.observe(element);
  };

  const unobserveItem = (element: HTMLElement | null): void => {
    if (!element || !observerRef.current) {
      return;
    }
    elementMap.current.delete(element);
    observerRef.current.unobserve(element);
  };

  return {observeItem, unobserveItem};
};
