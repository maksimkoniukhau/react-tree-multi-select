import {DROPDOWN_PREFIX, FIELD_PREFIX, VIRTUAL_FOCUS_ID_DELIMITER, VirtualFocusId} from '../types';
import {NullableVirtualFocusId} from '../innerTypes';

export const buildVirtualFocusId = (
  region: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX,
  elementId: string
): VirtualFocusId => {
  return `${region}${VIRTUAL_FOCUS_ID_DELIMITER}${elementId}`;
};

export const extractElementId = (virtualFocusId: NullableVirtualFocusId): string => {
  return virtualFocusId?.replace(`${FIELD_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`, '')
    .replace(`${DROPDOWN_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`, '') ?? '';
};

export const isVirtualFocusInField = (virtualFocusId: NullableVirtualFocusId): boolean => {
  return virtualFocusId?.startsWith(`${FIELD_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`) ?? false;
};

export const isVirtualFocusInDropdown = (virtualFocusId: NullableVirtualFocusId): boolean => {
  return virtualFocusId?.startsWith(`${DROPDOWN_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`) ?? false;
};
