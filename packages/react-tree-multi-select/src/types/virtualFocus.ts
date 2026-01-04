/**
 * String prefix used to identify virtual focus elements within the field area.
 * Combined with `VIRTUAL_FOCUS_ID_DELIMITER` and an element-specific suffix
 * to form a unique virtual focus identifier.
 */
export const FIELD_PREFIX = 'field';

/**
 * String prefix used to identify virtual focus elements within the dropdown area.
 * Combined with `VIRTUAL_FOCUS_ID_DELIMITER` and an element-specific suffix
 * to form a unique virtual focus identifier.
 */
export const DROPDOWN_PREFIX = 'dropdown';

/**
 * Delimiter used to join the region prefix and element-specific suffix
 * when forming a virtual focus identifier.
 */
export const VIRTUAL_FOCUS_ID_DELIMITER = ':';

/**
 * String suffix used to identify the virtual focus element
 * associated with the input field.
 */
export const INPUT_SUFFIX = 'rtms-input';

/**
 * String suffix used to identify the virtual focus element
 * associated with the `SelectAllContainer` component.
 */
export const SELECT_ALL_SUFFIX = 'rtms-select-all';

/**
 * String suffix used to identify the virtual focus element
 * associated with the `FieldClear` component.
 */
export const CLEAR_ALL_SUFFIX = 'rtms-clear-all';

/**
 * String suffix used to identify the virtual focus element
 * associated with the `Footer` component.
 */
export const FOOTER_SUFFIX = 'rtms-footer';

/**
 * Represents the identifier of a virtually focusable element within the component.
 *
 * The value is a string prefixed with either the `FIELD_PREFIX` or `DROPDOWN_PREFIX` constant,
 * followed by the `VIRTUAL_FOCUS_ID_DELIMITER` and an element-specific suffix.
 *
 * ### Format
 * A `virtualFocusId` for a node follows the format:
 *
 * ```
 * <region-prefix><delimiter><node-id>
 * ```
 *
 * **Examples:**
 *
 * ```
 * field:1
 * dropdown:123
 * ```
 *
 * ### Predefined Virtual Focus IDs:
 * Some virtually focusable elements use predefined `virtualFocusId` values:
 *
 * - `${FIELD_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}${INPUT_SUFFIX}` — **Input** component in a **Field**
 * - `${FIELD_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}${CLEAR_ALL_SUFFIX}` — **FieldClear** component in a **Field**
 * - `${DROPDOWN_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}${SELECT_ALL_SUFFIX}` — **SelectAll** component in a **Dropdown**
 * - `${DROPDOWN_PREFIX}${VIRTUAL_FOCUS_ID_DELIMITER}${FOOTER_SUFFIX}` — **Footer** component in a **Dropdown**
 */
export type VirtualFocusId =
  | `${typeof FIELD_PREFIX}${typeof VIRTUAL_FOCUS_ID_DELIMITER}${string}`
  | `${typeof DROPDOWN_PREFIX}${typeof VIRTUAL_FOCUS_ID_DELIMITER}${string}`;
