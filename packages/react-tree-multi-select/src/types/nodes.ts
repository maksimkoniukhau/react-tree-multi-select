/**
 * Interface representing a node.
 */
export interface TreeNode {
  /**
   * Unique identifier for the node.
   *
   * - The ID MUST be unique across the entire tree.
   * - The ID is used internally for tracking, selection, expansion, and virtual focus management.
   *
   * ### Important
   * Node IDs **MUST NOT conflict** with any predefined virtual focus
   * identifier suffixes (e.g., `INPUT_SUFFIX`, `CLEAR_ALL_SUFFIX`, `SELECT_ALL_SUFFIX`, `FOOTER_SUFFIX` constants),
   * as these are reserved for internal components and may cause unexpected behavior.
   * See `VirtualFocusId` type for more details.
   */
  id: string;

  /**
   * The display label of the node.
   */
  label: string;

  /**
   * Optional child nodes, enabling a nested tree structure.
   */
  children?: TreeNode[];

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
   * Indicates whether the node has child nodes.
   *
   * When set to `true`, the node is treated as expandable, even if its `children`
   * array is not yet populated. This is commonly used with lazy loading, where
   * the actual children are loaded on demand (via `onLoadChildren`).
   *
   * If omitted or set to `false`, the node is treated as a leaf node unless
   * child nodes are explicitly provided.
   */
  hasChildren?: boolean;

  /**
   * Additional properties can be added as needed.
   */
  [key: PropertyKey]: unknown;
}
