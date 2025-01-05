import {ComponentType, JSX, ReactNode, RefObject} from 'react';
import {ChipLabelProps} from './ChipLabel';
import {ChipProps} from './Chip';

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


export interface ComponentProps<CP, OP> {
  rootAttributes: JSX.IntrinsicElements['div'];
  ownProps: OP;
  componentProps: CP;
  componentRef?: RefObject<HTMLElement>;
  children?: ReactNode;
}

export interface Component<CP = {}, OP = {}> {
  component: ComponentType<ComponentProps<CP, OP>>;
  props?: OP;
}

export interface Components<COP = any, CCOP = any, CLOP = any> {
  Chip?: Component<ChipProps, COP>;
  ChipClear?: Component<{}, CCOP>;
  ChipLabel?: Component<ChipLabelProps, CLOP>;
}

export type Required<T> = {
  [K in keyof T]-?: T[K];
};

export type InnerComponents<COP = any, CCOP = any, CLOP = any> = Required<Components<COP, CCOP, CLOP>>;
