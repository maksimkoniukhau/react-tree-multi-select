import React, {RefObject} from 'react';
import {Type} from '../types';

export const typeToClassName = (type: Type): string => {
  return `rtms-${type.toLowerCase().replaceAll('_', '-')}-type`;
};

export const preventDefaultOnMouseEvent = (e: React.MouseEvent): void => {
  e.preventDefault();
};

export const getFieldFocusableElement = (fieldRef: RefObject<HTMLDivElement | null>): HTMLElement | null => {
  const focusableElements = getKeyboardFocusableElements(fieldRef?.current);
  return focusableElements.find(element => element.tagName === 'INPUT') || focusableElements[0] || fieldRef?.current;
};

/**
 * Gets keyboard-focusable html elements within a specified html element
 * @param {HTMLElement} htmlElement
 * @returns {Array<HTMLElement>}
 */
export const getKeyboardFocusableElements = (htmlElement: HTMLElement | null): HTMLElement[] => {
  return Array.from(htmlElement?.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])') || [])
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')) as HTMLElement[];
};

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
