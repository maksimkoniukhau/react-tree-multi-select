import {ComponentType} from 'react';

export enum Type {
  MULTI_SELECT_TREE = 'MULTI_SELECT_TREE',
  MULTI_SELECT_TREE_FLAT = 'MULTI_SELECT_TREE_FLAT',
  MULTI_SELECT = 'MULTI_SELECT',
  SELECT = 'SELECT'
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;

  [key: PropertyKey]: unknown;
}

export enum CheckedState {
  SELECTED = 'SELECTED',
  PARTIAL = 'PARTIAL',
  UNSELECTED = 'UNSELECTED'
}

export interface CustomComponent<P = {}, InnerProps = {}> {
  component: ComponentType<P & InnerProps>;
  props?: P;
}

export interface CustomComponents<FP = any> {
  Field?: CustomComponent<FP>;
}
