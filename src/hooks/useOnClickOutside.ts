import {RefObject, useEffect} from 'react';

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
    }, [target, handler]);
};
