import {DROPDOWN_PREFIX, FIELD_PREFIX, VirtualFocusId} from '../types';

export const buildVirtualFocusId = (
  element: string,
  location: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX
): VirtualFocusId => {
  return `${location}${element}`;
};

export const extractPathFromVirtualFocusId = (virtualFocusId: VirtualFocusId | null): string => {
  return virtualFocusId?.replace(FIELD_PREFIX, '').replace(DROPDOWN_PREFIX, '') ?? '';
};

export const isVirtualFocusInField = (virtualFocusId: VirtualFocusId | null): boolean => {
  return virtualFocusId?.startsWith(FIELD_PREFIX) ?? false;
};

export const isVirtualFocusInDropdown = (virtualFocusId: VirtualFocusId | null): boolean => {
  return virtualFocusId?.startsWith(DROPDOWN_PREFIX) ?? false;
};

export const isFocused = (
  element: string,
  location: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX,
  virtualFocusId: VirtualFocusId | null
): boolean => {
  return virtualFocusId === buildVirtualFocusId(element, location);
};
