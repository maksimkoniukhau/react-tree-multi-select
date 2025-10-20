import React from 'react';

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
  /** The display label of the node. */
  label: string;

  /** Optional child nodes, enabling a nested tree structure. */
  children?: TreeNode[];

  /** Whether the node is selected. */
  selected?: boolean;

  /** Whether the node is expanded to show its children. */
  expanded?: boolean;

  /** Whether the node is disabled. */
  disabled?: boolean;

  /** Additional properties can be added as needed. */
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
export const INPUT_SUFFIX = 'input';

/**
 * String suffix used to identify the virtual focus element
 * associated with the `SelectAllContainer` component.
 */
export const SELECT_ALL_SUFFIX = 'select-all';

/**
 * String suffix used to identify the virtual focus element
 * associated with the `FieldClear` component.
 */
export const CLEAR_ALL_SUFFIX = 'clear-all';

/**
 * String suffix used to identify the virtual focus element
 * associated with the `Footer` component.
 */
export const FOOTER_SUFFIX = 'footer';

/**
 * Represents the identifier of a virtually focused element within the component.
 *
 * The value is a string prefixed with either `FIELD` or `DROPDOWN` constants,
 * followed by an element-specific suffix.
 */
export type VirtualFocusId = `${typeof FIELD_PREFIX}${string}` | `${typeof DROPDOWN_PREFIX}${string}`;

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
   * When `true`, a search input is shown either in the field or in the dropdown (if `withDropdownInput` is also `true`).
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
   * Allows you to replace built-in components with your own implementations to match your design and behavior requirements.
   */
  components?: Components;
  /**
   * Callback triggered when the dropdown is opened or closed by user interaction.
   * This is used to synchronize external state with the dropdown’s rendering state.
   *
   * Note: This callback is only invoked when the `openDropdown` prop is provided.
   * If `openDropdown` is undefined, the component manages its own state and
   * `onDropdownToggle` will not be called.
   *
   * @param open - `true` if the dropdown was opened, `false` if it was closed.
   */
  onDropdownToggle?: (open: boolean) => void;
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

export interface ComponentProps<ComponentType, OwnProps, CustomProps = unknown> {
  attributes: React.HTMLProps<ComponentType>;
  ownProps: OwnProps;
  customProps: CustomProps;
  children?: React.ReactNode;
}

export interface Component<ComponentProps, CustomProps = unknown> {
  component: React.ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FieldOwnProps, CustomProps>;
export type ChipContainerProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, ChipContainerOwnProps, CustomProps>;
export type ChipLabelProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, ChipLabelOwnProps, CustomProps>;
export type ChipClearProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, ChipClearOwnProps, CustomProps>;
export type InputProps<CustomProps = unknown> = ComponentProps<HTMLInputElement, InputOwnProps, CustomProps>;
export type FieldClearProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FieldClearOwnProps, CustomProps>;
export type FieldToggleProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FieldToggleOwnProps, CustomProps>;
export type DropdownProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, DropdownOwnProps, CustomProps>;
export type SelectAllContainerProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, SelectAllContainerOwnProps, CustomProps>;
export type SelectAllCheckboxProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, SelectAllCheckboxOwnProps, CustomProps>;
export type SelectAllLabelProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, SelectAllLabelOwnProps, CustomProps>;
export type NodeContainerProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeContainerOwnProps, CustomProps>;
export type NodeToggleProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeToggleOwnProps, CustomProps>;
export type NodeCheckboxProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeCheckboxOwnProps, CustomProps>;
export type NodeLabelProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeLabelOwnProps, CustomProps>;
export type FooterProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FooterOwnProps, CustomProps>;
export type NoDataProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NoDataOwnProps, CustomProps>;

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
