/**
 * String prefix used to identify virtual focus elements within the field area.
 * Combined with an element-specific suffix to form a unique virtual focus identifier.
 */
export const FIELD_PREFIX = 'field:';

/**
 * String prefix used to identify virtual focus elements within the dropdown area.
 * Combined with an element-specific suffix to form a unique virtual focus identifier.
 */
export const DROPDOWN_PREFIX = 'dropdown:';

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
 * The value is a string prefixed with either `FIELD_PREFIX` or `DROPDOWN_PREFIX` constants,
 * followed by an element-specific suffix.
 *
 * ### Format
 * A `virtualFocusId` for a node follows the format:
 * ```
 * region-prefix:node-id
 * ```
 * **Examples:**
 * ```
 * field:1
 * dropdown:123
 * ```
 *
 * ### Predefined Virtual Focus IDs:
 * Some virtually focusable elements use predefined `virtualFocusId` values.
 *
 * - `${FIELD_PREFIX}${INPUT_SUFFIX}` — **Input** component in a **Field**
 * - `${FIELD_PREFIX}${CLEAR_ALL_SUFFIX}` — **FieldClear** component in a **Field**
 * - `${DROPDOWN_PREFIX}${SELECT_ALL_SUFFIX}` — **SelectAll** component in a **Dropdown**
 * - `${DROPDOWN_PREFIX}${FOOTER_SUFFIX}` — **Footer** component in a **Dropdown**
 *
 * See associated constants (`FIELD_PREFIX`, `DROPDOWN_PREFIX`, `INPUT_SUFFIX`, `SELECT_ALL_SUFFIX`, etc.)
 * for more details.
 */
export type VirtualFocusId = `${typeof FIELD_PREFIX}${string}` | `${typeof DROPDOWN_PREFIX}${string}`;
