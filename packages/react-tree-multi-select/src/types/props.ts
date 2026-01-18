import React from 'react';
import {Components} from './components';
import {SelectionAggregateState, Type} from './core';
import {FooterConfig, KeyboardConfig, VirtualFocusConfig} from './configs';
import {TreeNode} from './nodes';

/**
 * Props for the `TreeMultiSelect` component.
 *
 * Defines all configuration options, event callbacks, and customization points
 * for controlling the behavior, appearance, and data handling of the component.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface TreeMultiSelectProps<T extends TreeNode<T> = any> {
  /**
   * The data to be rendered in the component.
   */
  data: T[];

  /**
   * Specifies the type of the component, determining its behavior and rendering.
   *
   * @default Type.TREE_SELECT
   */
  type?: Type;

  /**
   * The IDs of the nodes that should be selected.
   *
   * - For `Type.SELECT` type, exactly **one ID** should be passed;
   *   if more than one ID is provided, only the **first ID** will be used.
   * - For other types it can contain multiple IDs.
   *
   * - The component treats this as a **controlled prop**.
   */
  selectedIds?: string[];

  /**
   * The IDs of the nodes that should be selected initially (uncontrolled mode).
   *
   * - For `Type.SELECT` type, exactly **one ID** should be passed;
   *   if more than one ID is provided, only the **first ID** will be used.
   * - For other types it can contain multiple IDs.
   * - Used **only when `selectedIds` is not provided**.
   * - The component will initialize its internal selection state using this value
   *   and will manage selection internally afterward.
   * - Changes to this prop after the initial render are ignored.
   */
  defaultSelectedIds?: string[];

  /**
   * The IDs of the nodes that should be expanded.
   *
   * - Used only when `type` is `Type.TREE_SELECT` or `Type.TREE_SELECT_FLAT`.
   *   For all other types, this prop is ignored.
   *
   * - The component treats this as a **controlled prop**.
   */
  expandedIds?: string[];

  /**
   * The IDs of the nodes that should be expanded initially (uncontrolled mode).
   *
   * - Used only when `type` is `Type.TREE_SELECT` or `Type.TREE_SELECT_FLAT`.
   *   For all other types, this prop is ignored.
   * - Used **only when `expandedIds` is not provided**.
   * - The component will initialize its internal expansion state using this value
   *   and will manage expansion internally afterward.
   * - Changes to this prop after the initial render are ignored.
   */
  defaultExpandedIds?: string[];

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
   * Closes the dropdown automatically after a node is changed (selected/deselected in dropdown).
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
   * The component treats this as a **controlled prop**.
   *
   * If omitted, the component manages the dropdown state internally.
   * For full control, use this prop in conjunction with the `onDropdownToggle` callback.
   */
  isDropdownOpen?: boolean;

  /**
   * Controls whether the dropdown should be open initially (uncontrolled mode).
   *
   * - Used only when `isDropdownOpen` is not provided.
   * - Initializes the internal open/close state on first render.
   * - The component manages the dropdown’s visibility internally afterward.
   * - Changes to this prop after the initial render are ignored.
   */
  defaultIsDropdownOpen?: boolean;

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
   * Controls virtual focus behavior for the component.
   */
  virtualFocusConfig?: VirtualFocusConfig;

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
   * Callback triggered when a node is selected or deselected.
   * This includes interactions from the dropdown as well as chip removal in the field.
   *
   * @param node - The node that was changed.
   * @param selectedIds - The list of currently selected nodes IDs.
   */
  onNodeChange?: (node: T, selectedIds: string[]) => void;

  /**
   * Callback triggered when a node is toggled (expanded or collapsed).
   *
   * @param node - The node that was toggled.
   * @param expandedIds - The list of currently expanded nodes IDs.
   */
  onNodeToggle?: (node: T, expandedIds: string[]) => void;

  /**
   * Callback triggered when the `FieldClear` component is activated by user interaction,
   * such as a mouse click or pressing the Backspace key.
   *
   * This is used to clear all selected nodes, except for nodes that are disabled.
   *
   * @param selectedIds - The list of currently selected nodes Ids.
   * @param selectionAggregateState - The current overall selection state of all nodes.
   */
  onClearAll?: (selectedIds: string[], selectionAggregateState: SelectionAggregateState) => void;

  /**
   * Callback triggered when the `SelectAll` component is activated by user interaction,
   * such as a mouse click or pressing the Enter key.
   *
   * This is used to select or deselect all nodes, except for nodes that are disabled.
   *
   * @param selectedIds - The list of currently selected nodes IDs.
   * @param selectionAggregateState - The current overall selection state of all nodes.
   */
  onSelectAllChange?: (selectedIds: string[], selectionAggregateState: SelectionAggregateState) => void;

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
  onDropdownLastItemReached?: (inputValue: string, displayedNodes: T[]) => void;

  /**
   * Callback for loading additional data to be appended to the end of the existing dataset.
   *
   * This is useful for implementing infinite scrolling, pagination, lazy loading, or incremental data fetching
   * where new items extend the current list rather than replacing it.
   *
   * This function is *not* invoked automatically by the component. Instead, it is triggered manually by the consumer
   * via the imperative `TreeMultiSelectHandle.loadData()` method.
   *
   * Note: The component automatically appends the nodes returned by this callback to the existing dataset.
   * It does not remove duplicates, merge updates, or otherwise reconcile data conflicts.
   * These responsibilities must be handled by the consumer.
   *
   * @returns A Promise resolving to an array of TreeNode objects to append.
   */
  onLoadData?: () => Promise<T[]>;

  /**
   * Callback for loading children of a specific node on demand.
   *
   * This function is called automatically by the component when the user expands a node that has not yet loaded
   * its children (i.e., the node’s `hasChildren` prop is `true`, and its children prop is not set or empty).
   * It enables lazy loading of hierarchical data for large trees or server-driven datasets.
   *
   * The function should return a Promise resolving to an array of TreeNode objects,
   * which will be set as the children of the specified node.
   *
   * Note: The component does not perform deduplication, merging, or conflict
   * resolution, so ensure the data returned is complete and correct for that node.
   *
   * @param id - The unique identifier of the node whose children are being loaded.
   * @returns A Promise resolving to an array of TreeNode objects to be set as the node’s children.
   */
  onLoadChildren?: (id: string) => Promise<T[]>;
}
