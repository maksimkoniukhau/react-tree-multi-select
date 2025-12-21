import {RefObject} from 'react';

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
  return Array.from(htmlElement?.querySelectorAll<HTMLElement>(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])') || [])
    .filter(el => {
      const style = window.getComputedStyle(el);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
      return isVisible
        && el.tabIndex >= 0
        && !el.hasAttribute('disabled')
        && el.getAttribute('aria-hidden') !== 'true';
    });
};

export const areSetsEqual = (a: Set<string>, b: Set<string>): boolean => {
  if (a.size !== b.size) {
    return false;
  }
  for (const val of a) {
    if (!b.has(val)) {
      return false;
    }
  }
  return true;
};

type ClassValue = string | undefined | null | false;

export const classNames = (...values: ClassValue[]): string => {
  return values.filter(Boolean).join(' ');
};
