import {SelectionAggregateState} from './core';
import {VirtualFocusId} from './virtualFocus';

/**
 * Represents the internal state of the component.
 */
export interface State {
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
