import {RefObject, useEffect, useLayoutEffect, useState} from 'react';

export const useResizeObserver = <T extends Element>(
  target: RefObject<T | null> | T | null,
  callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void
): void => {

  useLayoutEffect(() => {
    const targetElement = target && 'current' in target ? target.current : target as Element;
    if (!targetElement) return;

    const resizeObserver = new ResizeObserver(callback);

    resizeObserver.observe(targetElement);

    return () => resizeObserver.unobserve(targetElement);
  }, [target]);
};

export const useElementSize = <T extends HTMLElement>(target: RefObject<T | null> | T | null): [number, number] => {

  const [size, setSize] = useState<[number, number]>(() => {
    const targetEl = target && 'current' in target ? target.current : target as HTMLElement;
    return targetEl
      ? [targetEl.offsetWidth, targetEl.offsetHeight]
      : [0, 0];
  });

  useLayoutEffect(() => {
    const targetElement = target && 'current' in target ? target.current : target as HTMLElement;
    if (!targetElement) return;

    setSize([targetElement.offsetWidth, targetElement.offsetHeight]);
  }, [target]);

  useResizeObserver(target, (entries: ResizeObserverEntry[]) => {
    const targetElement = entries[0].target as HTMLElement;
    setSize([targetElement.offsetWidth, targetElement.offsetHeight]);
  });

  return size;
};

export const useOnClickOutside = <T extends HTMLElement>(
  target: RefObject<T | null> | T | null,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void
): void => {
  useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
        const targetElement = target && 'current' in target ? target.current : target as Element;
        if (!targetElement || targetElement.contains(event.target as Node)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      document.addEventListener("focusin", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
        document.removeEventListener("focusin", listener);
      };
    },
    [target, handler]
  );
};
