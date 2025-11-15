import React, {JSX} from 'react';

/**
 * Enum representing the different types of the component.
 */
export enum Type {
  /** Component behaves as a normal tree structure. */
  TREE_SELECT = 'TREE_SELECT',

  /** Component behaves as a flat tree structure (selecting a node has no effect on its descendants or ancestors). */
  TREE_SELECT_FLAT = 'TREE_SELECT_FLAT',

  /** Component behaves as a multi-select. */
  MULTI_SELECT = 'MULTI_SELECT',

  /** Component behaves as a simple select. */
  SELECT = 'SELECT'
}

/**
 * Interface representing a node.
 */
export interface TreeNode {
  /**
   * The display label of the node.
   */
  label: string;

  /**
   * Unique identifier for the node.
   *
   * - If provided by the user, it MUST be unique across the entire tree.
   * - If omitted, the component automatically generates an ID based on the node’s path,
   *   which represents the node’s hierarchical position within the tree data
   *   (e.g., `"0"`, `"1.0.3"`).
   * - The assigned ID is used internally for tracking, selection, expansion, and virtual focus management.
   *
   * ### Important
   * Node IDs provided by the user **MUST NOT conflict** with any predefined virtual focus
   * identifier suffixes (e.g., `INPUT_SUFFIX`, `CLEAR_ALL_SUFFIX`, `SELECT_ALL_SUFFIX`, `FOOTER_SUFFIX`),
   * as these are reserved for internal components and may cause unexpected behavior.
   * See `VirtualFocusId` type for more details.
   */
  id?: string;

  /**
   * Optional child nodes, enabling a nested tree structure.
   */
  children?: TreeNode[];

  /**
   * Whether the node is selected.
   */
  selected?: boolean;

  /**
   * Whether the node is expanded to show its children.
   */
  expanded?: boolean;

  /**
   * Whether the node is disabled.
   */
  disabled?: boolean;

  /**
   * When `true`, this node is excluded from the dropdown's virtual focus system.
   * It will not be focusable via keyboard navigation or mouse interaction within the dropdown.
   *
   * @default false
   */
  skipDropdownVirtualFocus?: boolean;

  /**
   * Additional properties can be added as needed.
   */
  [key: PropertyKey]: unknown;
}

/**
 * Enum representing the checked state for the SelectAll component.
 */
export enum CheckedState {
  /** All items are selected. */
  SELECTED = 'SELECTED',

  /** Some (but not all) items are selected (partial selection). */
  PARTIAL = 'PARTIAL',

  /** No items are selected. */
  UNSELECTED = 'UNSELECTED'
}

/**
 * Configuration options for keyboard behavior in the Field component.
 */
export type FieldKeyboardOptions = {
  /**
   * Enables looping when navigating left with the ArrowLeft key.
   * If `true`, pressing ArrowLeft on the first item will move focus to the last item.
   *
   * @default false
   */
  loopLeft?: boolean;

  /**
   * Enables looping when navigating right with the ArrowRight key.
   * If `true`, pressing ArrowRight on the last item will move focus to the first item.
   *
   * @default false
   */
  loopRight?: boolean;
};

/**
 * Configuration options for keyboard behavior in the Dropdown component.
 */
export type DropdownKeyboardOptions = {
  /**
   * Enables looping when navigating upward with the ArrowUp key.
   * If `true`, pressing ArrowUp on the first item will move focus to the last item.
   *
   * @default true
   */
  loopUp?: boolean;

  /**
   * Enables looping when navigating downward with the ArrowDown key.
   * If `true`, pressing ArrowDown on the last item will move focus to the first item.
   *
   * @default true
   */
  loopDown?: boolean;
};

/**
 * Controls keyboard navigation behavior for the component.
 */
export type KeyboardConfig = {
  /**
   * Configuration for the Field component.
   */
  field?: FieldKeyboardOptions;

  /**
   * Configuration for the Dropdown component.
   */
  dropdown?: DropdownKeyboardOptions;
};

/**
 * Controls when the Footer component is rendered in the dropdown.
 */
export type FooterConfig = {
  /**
   * Renders the Footer when the component is in the search mode (when the input contains value).
   *
   * @default false
   */
  showWhenSearching?: boolean;

  /**
   * Renders the Footer when no items are available in the dropdown
   * (takes precedence over `showWhenSearching` if both apply).
   *
   * @default false
   */
  showWhenNoItems?: boolean;
}

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
 * The value is a string prefixed with either `FIELD` or `DROPDOWN` constants,
 * followed by an element-specific suffix.
 *
 * ### Format
 * A `virtualFocusId` for a node follows the format:
 * ```
 * region-prefix:node-id
 * ```
 * **Examples:**
 * ```
 * field:1.0.0
 * dropdown:123
 * ```
 *
 * The **region prefix** (a region-specific constant such as `FIELD_PREFIX` or `DROPDOWN_PREFIX`)
 * identifies the focus region, while the **node-id** represents the node’s unique identifier —
 * either provided by the user or automatically generated from the node’s hierarchical path
 * (e.g., `"1.0.0"`).
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

/**
 * Represents the internal state of the component.
 */
export interface State {
  /**
   * Represents the current overall selection state of all nodes in the tree.
   */
  allNodesSelectionState: CheckedState;

  /**
   * The current search input value.
   */
  inputValue: string;

  /**
   * Indicates whether the dropdown is currently open (rendered).
   */
  isDropdownOpen: boolean;

  /**
   * The identifier of the currently virtually focused element,
   * or `null` if no element is virtually focused.
   */
  virtualFocusId: VirtualFocusId | null;
}

export interface TreeMultiSelectHandle {
  /**
   * Returns a snapshot of the current internal component state.
   *
   * The returned object is always up-to-date at the moment of the call.
   */
  getState: () => State;

  /**
   * Opens (renders) the dropdown.
   */
  openDropdown: () => void;

  /**
   * Closes (hides) the dropdown.
   */
  closeDropdown: () => void;

  /**
   * Toggles the dropdown's visibility.
   *
   * - If the dropdown is currently closed, it will be opened.
   * - If the dropdown is currently open, it will be closed.
   */
  toggleDropdown: () => void;

  /**
   * Selects all nodes, except for nodes that are disabled.
   */
  selectAll: () => void;

  /**
   * Deselects all nodes, except for nodes that are disabled.
   */
  deselectAll: () => void;

  /**
   * Toggles the selection state of all selectable nodes.
   *
   * - If all selectable nodes are currently selected, this will unselect all of them.
   * - Otherwise, it will select all selectable nodes.
   */
  toggleAllSelection: () => void;

  /**
   * Expands a node in the tree.
   *
   * Does nothing if the node is already expanded or not expandable.
   *
   * @param id - The unique identifier of the node to expand.
   * If omitted, the currently virtually focused node in the dropdown will be expanded
   * if it exists and is expandable.
   */
  expandNode: (id?: string) => void;

  /**
   * Collapses a node in the tree.
   *
   * Does nothing if the node is already collapsed or not collapsible.
   *
   * @param id - The unique identifier of the node to collapse.
   * If omitted, the currently virtually focused node in the dropdown will be collapsed
   * if it exists and is collapsible.
   */
  collapseNode: (id?: string) => void;

  /**
   * Toggles the expansion state of a node.
   *
   * - If the node is expanded, it will be collapsed.
   * - If the node is collapsed and expandable, it will be expanded.
   *
   * @param id - The unique identifier of the node to toggle.
   * If omitted, the currently virtually focused node in the dropdown will be toggled
   * if it exists and is expandable/collapsible.
   */
  toggleNodeExpansion: (id?: string) => void;

  /**
   * Selects a node explicitly.
   *
   * Does nothing if the node is already selected or not selectable.
   *
   * @param id - The unique identifier of the node to select.
   * If omitted, the currently virtually focused node will be selected if it exists and is selectable.
   */
  selectNode: (id?: string) => void;

  /**
   * Deselects a node explicitly.
   *
   * Does nothing if the node is already deselected or not selectable.
   *
   * @param id - The unique identifier of the node to deselect.
   * If omitted, the currently virtually focused node will be deselected if it exists and is selectable.
   */
  deselectNode: (id?: string) => void;

  /**
   * Toggles the selection of a node based on its current state.
   *
   * - If the node is fully selected or partially selected (with all non-disabled children selected),
   *   it will be deselected.
   * - Otherwise, it will be selected.
   *
   * @param id - The unique identifier of the node whose selection state should be toggled.
   * If omitted, the currently virtually focused node will toggle its selection state if it exists and is selectable.
   */
  toggleNodeSelection: (id?: string) => void;

  /**
   * Moves virtual focus to the first virtually focusable element.
   *
   * - If `region` is provided, moves focus to the first element in that region (`FIELD` or `DROPDOWN`),
   *   ignoring the current virtual focus.
   * - If `region` is omitted, moves focus within the same region as the currently focused element.
   *   Does nothing if there is no currently focused element (`virtualFocusId` is `null`).
   *
   * @param region - The focus region to target.
   */
  focusFirstItem: (region?: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX) => void;

  /**
   * Moves virtual focus to the last virtually focusable element.
   *
   * - If `region` is provided, moves focus to the last element in that region (`FIELD` or `DROPDOWN`),
   *   ignoring the current virtual focus.
   * - If `region` is omitted, moves focus within the same region as the currently focused element.
   *   Does nothing if there is no currently focused element (`virtualFocusId` is `null`).
   *
   * @param region - The focus region to target.
   */
  focusLastItem: (region?: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX) => void;

  /**
   * Moves virtual focus to the previous virtually focusable element.
   *
   * - If `virtualFocusId` is provided, moves focus to the element immediately preceding
   *   the specified element, ignoring the currently focused element.
   * - If `virtualFocusId` is omitted, moves focus to the element immediately preceding
   *   the currently virtually focused element.
   *   Does nothing if there is no currently focused element (`virtualFocusId` is `null`).
   *
   * @param virtualFocusId - The identifier of the virtually focusable element
   * from which to move the virtual focus.
   */
  focusPrevItem: (virtualFocusId?: VirtualFocusId) => void;

  /**
   * Moves virtual focus to the next virtually focusable element.
   *
   * - If `virtualFocusId` is provided, moves focus to the element immediately following
   *   the specified element, ignoring the currently focused element.
   * - If `virtualFocusId` is omitted, moves focus to the element immediately following
   *   the currently virtually focused element.
   *   Does nothing if there is no currently focused element (`virtualFocusId` is `null`).
   *
   * @param virtualFocusId - The identifier of the virtually focusable element
   * from which to move the virtual focus.
   */
  focusNextItem: (virtualFocusId?: VirtualFocusId) => void;
}

/**
 * Props for the `TreeMultiSelect` component.
 *
 * Defines all configuration options, event callbacks, and customization points
 * for controlling the behavior, appearance, and data handling of the component.
 */
export interface TreeMultiSelectProps {
  /**
   * The data to be rendered in the component.
   */
  data: TreeNode[];

  /**
   * Specifies the type of the component, determining its behavior and rendering.
   *
   * @default Type.TREE_SELECT
   */
  type?: Type;

  /**
   * The `id` attribute to apply to the root `<div>` of the component.
   */
  id?: string;

  /**
   * The `className` to apply to the root `<div>` of the component.
   */
  className?: string;

  /**
   * Placeholder text displayed in the search input field.
   *
   * @default "search..."
   */
  inputPlaceholder?: string;

  /**
   * Text displayed when there is no data to show in the dropdown.
   *
   * @default "No data"
   */
  noDataText?: string;

  /**
   * Text displayed when no matching results are found during a search.
   *
   * @default "No matches"
   */
  noMatchesText?: string;

  /**
   * Disables the entire component, preventing user interaction.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Controls whether the search input is rendered.
   * When `true`, a search input is shown either in the field
   * or in the dropdown (if `withDropdownInput` is also `true`).
   *
   * @default true
   */
  isSearchable?: boolean;

  /**
   * Controls whether the chip-level clear button (`ChipClear`) is displayed for each selected item.
   *
   * @default true
   */
  withChipClear?: boolean;

  /**
   * Controls whether the field-level clear button (`FieldClear`) is displayed to clear all selected items at once.
   *
   * @default true
   */
  withClearAll?: boolean;

  /**
   * Controls whether a sticky "SelectAll" component is rendered at the top of the dropdown.
   *
   * This option is automatically hidden when:
   * - `type` is `Type.SELECT`
   * - the search input has a value (search mode)
   * - there is no available data
   *
   * @default false
   */
  withSelectAll?: boolean;

  /**
   * Controls whether a sticky search input is rendered at the top of the dropdown.
   * A hidden input is rendered in the field to preserve focus behavior.
   *
   * @default false
   */
  withDropdownInput?: boolean;

  /**
   * Closes the dropdown automatically after a node is changed (selected/unselected in dropdown).
   * Useful when `type` is `Type.SELECT`.
   *
   * @default false
   */
  closeDropdownOnNodeChange?: boolean;

  /**
   * Controls whether the dropdown is rendered (open) or hidden (closed).
   * This enables external control over the dropdown's rendering state.
   *
   * When set to `true`, the dropdown is rendered (opened).
   * When set to `false`, the dropdown is hidden (closed).
   *
   * If omitted, the component manages the dropdown state internally.
   * For full control, use this prop in conjunction with the `onDropdownToggle` callback.
   */
  openDropdown?: boolean;

  /**
   * Dropdown height in pixels. If the content height is smaller than this value,
   * the dropdown height is automatically reduced to fit the content.
   *
   * @default 300
   */
  dropdownHeight?: number;

  /**
   * The number of items to render outside the visible viewport (above and below)
   * to improve scroll performance and reduce flickering during fast scrolling.
   *
   * @default 1
   */
  overscan?: number;

  /**
   * Determines whether the dropdown list is rendered using virtualization.
   * When enabled, only the visible portion of the list (plus overscan items)
   * is rendered to improve performance with large datasets.
   *
   * @default true
   */
  isVirtualized?: boolean;

  /**
   * Controls when the Footer component is rendered in the dropdown.
   */
  footerConfig?: FooterConfig;

  /**
   * Controls keyboard navigation behavior for the component.
   */
  keyboardConfig?: KeyboardConfig;

  /**
   * Custom components used to override the default UI elements of the TreeMultiSelect.
   *
   * Allows you to replace built-in components with your own implementations
   * to match your design and behavior requirements.
   */
  components?: Components;

  /**
   * Callback triggered when the dropdown is opened or closed.
   *
   * @param isOpen - `true` if the dropdown was opened, `false` if it was closed.
   */
  onDropdownToggle?: (isOpen: boolean) => void;

  /**
   * Callback triggered when a node is selected or unselected.
   * This includes interactions from the dropdown as well as chip removal in the field.
   *
   * @param node - The node that was changed.
   * @param selectedNodes - The list of currently selected nodes.
   * @param data - The full tree data reflecting the updated state.
   */
  onNodeChange?: (node: TreeNode, selectedNodes: TreeNode[], data: TreeNode[]) => void;

  /**
   * Callback triggered when a node is toggled (expanded or collapsed).
   *
   * @param node - The node that was toggled.
   * @param expandedNodes - The list of currently expanded nodes.
   * @param data - The full tree data reflecting the updated state.
   */
  onNodeToggle?: (node: TreeNode, expandedNodes: TreeNode[], data: TreeNode[]) => void;

  /**
   * Callback triggered when the `FieldClear` component is activated by user interaction,
   * such as a mouse click or pressing the Backspace key.
   *
   * This is used to clear all selected nodes, except for nodes that are disabled.
   *
   * @param selectedNodes - The list of currently selected nodes.
   * @param selectAllCheckedState - The current check state of the `SelectAll` component,
   * or `undefined` if the component type is `Type.SELECT`.
   * @param data - The full tree data reflecting the updated state.
   */
  onClearAll?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState | undefined, data: TreeNode[]) => void;

  /**
   * Callback triggered when the `SelectAll` component is activated by user interaction,
   * such as a mouse click or pressing the Enter key.
   *
   * This is used to select or unselect all nodes, except for nodes that are disabled.
   *
   * @param selectedNodes - The list of currently selected nodes.
   * @param selectAllCheckedState - The current check state of the `SelectAll` component.
   * @param data - The full tree data reflecting the updated state.
   */
  onSelectAllChange?: (selectedNodes: TreeNode[], selectAllCheckedState: CheckedState, data: TreeNode[]) => void;

  /**
   * Callback triggered when the component receives focus.
   *
   * @param event - The React focus event.
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Callback triggered when the component loses focus.
   *
   * @param event - The React blur event.
   */
  onBlur?: (event: React.FocusEvent) => void;

  /**
   * Callback triggered on keyboard interaction within the component.
   *
   * This allows interception or customization of the built-in keyboard behavior.
   *
   * - Returning `true` prevents the component’s default keyboard handling for the event.
   * - Returning `false` or `undefined` allows the component’s default handling to continue.
   *
   * This means the user can simply omit a return statement if they do not want
   * to block the default behavior.
   *
   * @param event - The original keyboard event.
   * @returns `true` to stop the default keyboard handling; otherwise `false` or `undefined`.
   */
  onKeyDown?: (event: React.KeyboardEvent) => boolean | undefined;

  /**
   * Callback triggered when the last item in the dropdown is rendered.
   * This is useful for implementing infinite scrolling or lazy loading.
   *
   * Note: The callback is invoked when the last item (including overscan)
   * is rendered, not based on actual scroll position.
   *
   * @param inputValue - The current search input value.
   * @param displayedNodes - An array of TreeNode objects currently displayed in the dropdown.
   */
  onDropdownLastItemReached?: (inputValue: string, displayedNodes: TreeNode[]) => void;
}

export interface FieldOwnProps {
  type: Type;
  showDropdown: boolean;
  withClearAll: boolean;
  componentDisabled: boolean;
}

export interface ChipContainerOwnProps {
  label: string;
  focused: boolean;
  disabled: boolean;
  componentDisabled: boolean;
  withChipClear: boolean;
}

export interface ChipLabelOwnProps {
  label: string;
  componentDisabled: boolean;
}

export interface ChipClearOwnProps {
  componentDisabled: boolean;
}

export interface InputOwnProps {
  placeholder: string;
  value: string;
  disabled: boolean;
}

export interface FieldClearOwnProps {
  focused: boolean;
  componentDisabled: boolean;
}

export interface FieldToggleOwnProps {
  expanded: boolean;
  componentDisabled: boolean;
}

export interface DropdownOwnProps {
  componentDisabled: boolean;
}

export interface SelectAllContainerOwnProps {
  label: string;
  checkedState: CheckedState;
  focused: boolean;
}

export interface SelectAllCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
}

export interface SelectAllLabelOwnProps {
  label: string;
}

export interface NodeContainerOwnProps {
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
}

export interface NodeToggleOwnProps {
  expanded: boolean;
}

export interface NodeCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
  disabled: boolean;
}

export interface NodeLabelOwnProps {
  label: string;
}

export interface FooterOwnProps {
  focused: boolean;
}

export interface NoDataOwnProps {
  label: string;
}

export type Attributes<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag] & {
  'data-rtms-virtual-focus-id'?: string;
};

export interface ComponentProps<Tag extends keyof JSX.IntrinsicElements, OwnProps, CustomProps = unknown> {
  attributes: Attributes<Tag>;
  ownProps: OwnProps;
  customProps: CustomProps;
  children?: React.ReactNode;
}

export interface Component<ComponentProps, CustomProps = unknown> {
  component: React.ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = unknown> = ComponentProps<'div', FieldOwnProps, CustomProps>;
export type ChipContainerProps<CustomProps = unknown> = ComponentProps<'div', ChipContainerOwnProps, CustomProps>;
export type ChipLabelProps<CustomProps = unknown> = ComponentProps<'div', ChipLabelOwnProps, CustomProps>;
export type ChipClearProps<CustomProps = unknown> = ComponentProps<'div', ChipClearOwnProps, CustomProps>;
export type InputProps<CustomProps = unknown> = ComponentProps<'input', InputOwnProps, CustomProps>;
export type FieldClearProps<CustomProps = unknown> = ComponentProps<'div', FieldClearOwnProps, CustomProps>;
export type FieldToggleProps<CustomProps = unknown> = ComponentProps<'div', FieldToggleOwnProps, CustomProps>;
export type DropdownProps<CustomProps = unknown> = ComponentProps<'div', DropdownOwnProps, CustomProps>;
export type SelectAllContainerProps<CustomProps = unknown> = ComponentProps<'div', SelectAllContainerOwnProps, CustomProps>;
export type SelectAllCheckboxProps<CustomProps = unknown> = ComponentProps<'div', SelectAllCheckboxOwnProps, CustomProps>;
export type SelectAllLabelProps<CustomProps = unknown> = ComponentProps<'div', SelectAllLabelOwnProps, CustomProps>;
export type NodeContainerProps<CustomProps = unknown> = ComponentProps<'div', NodeContainerOwnProps, CustomProps>;
export type NodeToggleProps<CustomProps = unknown> = ComponentProps<'div', NodeToggleOwnProps, CustomProps>;
export type NodeCheckboxProps<CustomProps = unknown> = ComponentProps<'div', NodeCheckboxOwnProps, CustomProps>;
export type NodeLabelProps<CustomProps = unknown> = ComponentProps<'div', NodeLabelOwnProps, CustomProps>;
export type FooterProps<CustomProps = unknown> = ComponentProps<'div', FooterOwnProps, CustomProps>;
export type NoDataProps<CustomProps = unknown> = ComponentProps<'div', NoDataOwnProps, CustomProps>;

export type FieldType<CustomProps = unknown> = Component<FieldProps<CustomProps>, CustomProps>;
export type ChipContainerType<CustomProps = unknown> = Component<ChipContainerProps<CustomProps>, CustomProps>;
export type ChipLabelType<CustomProps = unknown> = Component<ChipLabelProps<CustomProps>, CustomProps>;
export type ChipClearType<CustomProps = unknown> = Component<ChipClearProps<CustomProps>, CustomProps>;
export type InputType<CustomProps = unknown> = Component<InputProps<CustomProps>, CustomProps>;
export type FieldClearType<CustomProps = unknown> = Component<FieldClearProps<CustomProps>, CustomProps>;
export type FieldToggleType<CustomProps = unknown> = Component<FieldToggleProps<CustomProps>, CustomProps>;
export type DropdownType<CustomProps = unknown> = Component<DropdownProps<CustomProps>, CustomProps>;
export type SelectAllContainerType<CustomProps = unknown> = Component<SelectAllContainerProps<CustomProps>, CustomProps>;
export type SelectAllCheckboxType<CustomProps = unknown> = Component<SelectAllCheckboxProps<CustomProps>, CustomProps>;
export type SelectAllLabelType<CustomProps = unknown> = Component<SelectAllLabelProps<CustomProps>, CustomProps>;
export type NodeContainerType<CustomProps = unknown> = Component<NodeContainerProps<CustomProps>, CustomProps>;
export type NodeToggleType<CustomProps = unknown> = Component<NodeToggleProps<CustomProps>, CustomProps>;
export type NodeCheckboxType<CustomProps = unknown> = Component<NodeCheckboxProps<CustomProps>, CustomProps>;
export type NodeLabelType<CustomProps = unknown> = Component<NodeLabelProps<CustomProps>, CustomProps>;
export type FooterType<CustomProps = unknown> = Component<FooterProps<CustomProps>, CustomProps>;
export type NoDataType<CustomProps = unknown> = Component<NoDataProps<CustomProps>, CustomProps>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ComponentTypes = {
  Field: FieldType<any>;
  ChipContainer: ChipContainerType<any>;
  ChipLabel: ChipLabelType<any>;
  ChipClear: ChipClearType<any>;
  Input: InputType<any>;
  FieldClear: FieldClearType<any>;
  FieldToggle: FieldToggleType<any>;
  Dropdown: DropdownType<any>;
  SelectAllContainer: SelectAllContainerType<any>;
  SelectAllCheckbox: SelectAllCheckboxType<any>;
  SelectAllLabel: SelectAllLabelType<any>;
  NodeContainer: NodeContainerType<any>;
  NodeToggle: NodeToggleType<any>;
  NodeCheckbox: NodeCheckboxType<any>;
  NodeLabel: NodeLabelType<any>;
  Footer: FooterType<any>;
  NoData: NoDataType<any>;
};

export type ComponentNames = keyof ComponentTypes;

export type Components<
  ComponentsMap extends Partial<ComponentTypes>
    & Record<Exclude<keyof ComponentsMap, ComponentNames>, never> = any
> = {
  [K in ComponentNames]?: Component<
    ComponentTypes[K] extends Component<infer ComponentProps, any> ? ComponentProps : never,
    K extends keyof ComponentsMap
      ? ComponentsMap[K] extends Component<any, infer CustomProps>
        ? CustomProps
        : unknown
      : unknown
  >;
};
