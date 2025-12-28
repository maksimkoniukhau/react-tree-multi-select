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

  /** Component behaves as a single-select. */
  SINGLE_SELECT = 'SINGLE_SELECT'
}

/**
 * Enum representing the aggregate selection state of all nodes.
 */
export enum SelectionAggregateState {
  /** All nodes are selected. */
  ALL = 'ALL',

  /** All selectable (non-disabled) nodes are selected. */
  EFFECTIVE_ALL = 'EFFECTIVE_ALL',

  /** Some, but not all, nodes are selected. */
  PARTIAL = 'PARTIAL',

  /** No nodes are selected. */
  NONE = 'NONE'
}
