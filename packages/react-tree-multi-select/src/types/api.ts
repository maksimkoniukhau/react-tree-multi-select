import {TreeNode} from './nodes';
import {State} from './state';
import {DROPDOWN_PREFIX, FIELD_PREFIX, VirtualFocusId} from './virtualFocus';

/**
 * Imperative API for interacting with the TreeMultiSelect component.
 *
 * A `TreeMultiSelectHandle` instance can be obtained by passing a `ref`
 * to the component (e.g., `useRef<TreeMultiSelectHandle>(null)`).
 *
 * All methods operate on the most recent internal state at the moment
 * they are called.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface TreeMultiSelectHandle<T extends TreeNode<T> = any> {
  /**
   * Returns a snapshot of the current internal component state.
   *
   * The returned object is always up-to-date at the moment of the call.
   *
   * @returns The current internal state of the TreeMultiSelect component.
   */
  getState: () => State;

  /**
   * Returns a node by its unique identifier.
   *
   * The identifier corresponds to the node `id`.
   *
   * @param id - The unique identifier of the node.
   * @returns The matching `TreeNode` if found; otherwise `undefined`.
   */
  getById: (id: string) => T | undefined;

  /**
   * Loads additional data and appends it to the current dataset.
   *
   * This method calls the `onLoadData` callback internally and merges the returned
   * nodes with the existing data. It does nothing if `onLoadData` is not provided
   * or returns an empty array.
   *
   * @returns A Promise that resolves once the data has been loaded and appended.
   */
  loadData: () => Promise<void>;

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
   * - If all selectable nodes are currently selected, this will deselect all of them.
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
   * Does nothing if the node is already unselected or not selectable.
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
