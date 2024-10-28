export enum Type {
  MULTISELECT_TREE,
  MULTISELECT_FLAT
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;

  [key: PropertyKey]: unknown;
}

export enum SelectAllCheckedState {
  SELECTED,
  PARTIAL,
  UNSELECTED
}
