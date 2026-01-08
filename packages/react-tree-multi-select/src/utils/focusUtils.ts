import {DROPDOWN_PREFIX, FIELD_PREFIX, VIRTUAL_FOCUS_ID_DELIMITER, VirtualFocusId} from '../types';

/**
 * Builds a virtual focus identifier for a focusable element.
 *
 * @param region - The focus region (`FIELD` or `DROPDOWN`) in which the element resides.
 * @param elementId - The unique identifier of the element within that region.
 * @returns A `VirtualFocusId` representing the virtually focusable element.
 */
export const buildVirtualFocusId = (
  region: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX,
  elementId: string
): VirtualFocusId => {
  return `${region}${VIRTUAL_FOCUS_ID_DELIMITER}${elementId}`;
};

/**
 * Extracts the underlying element identifier from a virtual focus identifier.
 *
 * If the provided `virtualFocusId` is `null`, an empty string is returned.
 *
 * @param virtualFocusId - The virtual focus identifier from which the element identifier should be extracted.
 * @returns The element identifier string, or an empty string if unavailable.
 */
export const extractElementId = (virtualFocusId: VirtualFocusId | null): string => {
  return virtualFocusId?.replace(`${FIELD_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`, '')
    .replace(`${DROPDOWN_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`, '') ?? '';
};

/**
 * Determines whether the virtual focus resides in the field region.
 *
 * @param virtualFocusId - The virtual focus identifier to evaluate.
 * @returns `true` if the virtual focus is within the field region, otherwise `false`.
 */
export const isVirtualFocusInField = (virtualFocusId: VirtualFocusId | null): boolean => {
  return virtualFocusId?.startsWith(`${FIELD_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`) ?? false;
};

/**
 * Determines whether the virtual focus resides in the dropdown region.
 *
 * @param virtualFocusId - The virtual focus identifier to evaluate.
 * @returns `true` if the virtual focus is within the dropdown region, otherwise `false`.
 */
export const isVirtualFocusInDropdown = (virtualFocusId: VirtualFocusId | null): boolean => {
  return virtualFocusId?.startsWith(`${DROPDOWN_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}`) ?? false;
};
