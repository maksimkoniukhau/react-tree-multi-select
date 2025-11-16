import {DROPDOWN_PREFIX, FIELD_PREFIX, VirtualFocusId} from '../types';
import {NullableVirtualFocusId} from '../innerTypes';

export const buildVirtualFocusId = (
  region: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX,
  elementId: string
): VirtualFocusId => {
  return `${region}${elementId}`;
};

export const extractElementId = (virtualFocusId: NullableVirtualFocusId): string => {
  return virtualFocusId?.replace(FIELD_PREFIX, '').replace(DROPDOWN_PREFIX, '') ?? '';
};

export const isVirtualFocusInField = (virtualFocusId: NullableVirtualFocusId): boolean => {
  return virtualFocusId?.startsWith(FIELD_PREFIX) ?? false;
};

export const isVirtualFocusInDropdown = (virtualFocusId: NullableVirtualFocusId): boolean => {
  return virtualFocusId?.startsWith(DROPDOWN_PREFIX) ?? false;
};
