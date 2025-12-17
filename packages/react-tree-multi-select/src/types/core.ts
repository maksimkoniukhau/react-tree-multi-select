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
