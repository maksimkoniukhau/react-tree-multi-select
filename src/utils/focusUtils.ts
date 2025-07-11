import {DROPDOWN, FIELD} from '../constants';

export const buildFocusedElement = (element: string, location: typeof FIELD | typeof DROPDOWN): string => {
  return `${location}${element}`;
};

export const extractPathFromFocusedElement = (focusedElement: string): string => {
  return focusedElement.replace(FIELD, '').replace(DROPDOWN, '');
};

export const isFocusedElementInField = (focusedElement: string): boolean => {
  return focusedElement?.startsWith(FIELD);
};

export const isFocusedElementInDropdown = (focusedElement: string): boolean => {
  return focusedElement?.startsWith(DROPDOWN);
};

export const isFocused = (element: string, location: typeof FIELD | typeof DROPDOWN, focusedElement: string): boolean => {
  return focusedElement === `${location}${element}`;
};
