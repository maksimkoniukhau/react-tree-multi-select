import {VirtualFocusId} from '../types';
import {DROPDOWN, FIELD} from '../constants';

export const buildVirtualFocusId = (element: string, location: typeof FIELD | typeof DROPDOWN): VirtualFocusId => {
  return `${location}${element}`;
};

export const extractPathFromVirtualFocusId = (virtualFocusId: VirtualFocusId | null): string => {
  return virtualFocusId?.replace(FIELD, '').replace(DROPDOWN, '') ?? '';
};

export const isVirtualFocusInField = (virtualFocusId: VirtualFocusId | null): boolean => {
  return virtualFocusId?.startsWith(FIELD) ?? false;
};

export const isVirtualFocusInDropdown = (virtualFocusId: VirtualFocusId | null): boolean => {
  return virtualFocusId?.startsWith(DROPDOWN) ?? false;
};

export const isFocused = (
  element: string,
  location: typeof FIELD | typeof DROPDOWN,
  virtualFocusId: VirtualFocusId | null
): boolean => {
  return virtualFocusId === buildVirtualFocusId(element, location);
};
