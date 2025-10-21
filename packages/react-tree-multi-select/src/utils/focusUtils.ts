import {DROPDOWN_PREFIX, FIELD_PREFIX, VirtualFocusId} from '../types';
import {NullableVirtualFocusId} from '../innerTypes';

export const buildVirtualFocusId = (
  element: string,
  location: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX
): VirtualFocusId => {
  return `${location}${element}`;
};

export const extractPathFromVirtualFocusId = (virtualFocusId: NullableVirtualFocusId): string => {
  return virtualFocusId?.replace(FIELD_PREFIX, '').replace(DROPDOWN_PREFIX, '') ?? '';
};

export const isVirtualFocusInField = (virtualFocusId: NullableVirtualFocusId): boolean => {
  return virtualFocusId?.startsWith(FIELD_PREFIX) ?? false;
};

export const isVirtualFocusInDropdown = (virtualFocusId: NullableVirtualFocusId): boolean => {
  return virtualFocusId?.startsWith(DROPDOWN_PREFIX) ?? false;
};

export const isFocused = (
  element: string,
  location: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX,
  virtualFocusId: NullableVirtualFocusId
): boolean => {
  return virtualFocusId === buildVirtualFocusId(element, location);
};
