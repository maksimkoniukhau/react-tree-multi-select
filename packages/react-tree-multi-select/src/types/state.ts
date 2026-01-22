import {SelectionAggregateState} from './core';
import {VirtualFocusId} from './virtualFocus';

/**
 * Represents the internal state of the component.
 */
export interface State {
  /**
   * The IDs of the nodes that are currently selected.
   *
   * - In **controlled mode**, this value mirrors the `selectedIds` prop.
   * - In **uncontrolled mode**, this value is managed internally by the component.
   * - For `Type.SELECT`, this array contains at most **one ID**.
   */
  selectedIds: string[];

  /**
   * The IDs of the nodes that are currently expanded.
   *
   * - In **controlled mode**, this value mirrors the `expandedIds` prop.
   * - In **uncontrolled mode**, this value is managed internally by the component.
   * - For component types other than `Type.TREE_SELECT` and `Type.TREE_SELECT_FLAT`,
   * this value is always an **empty array**.
   */
  expandedIds: string[];

  /**
   * Represents the current overall selection state of all nodes.
   */
  selectionAggregateState: SelectionAggregateState;

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
