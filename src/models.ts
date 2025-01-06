import {ComponentType, JSX, ReactNode, RefObject} from 'react';
import {ChipProps} from './Chip';
import {ChipLabelProps} from './ChipLabel';
import {ChipClearProps} from './ChipClear';
import {FieldClearProps} from './FieldClear';
import {FieldToggleProps} from './FieldToggle';

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

export interface Components<
  ChipOwnProps = any,
  ChipLabelOwnProps = any,
  ChipClearOwnProps = any,
  FieldClearOwnProps = any,
  FieldToggleOwnProps = any
> {
  Chip?: Component<ChipProps, ChipOwnProps>;
  ChipLabel?: Component<ChipLabelProps, ChipLabelOwnProps>;
  ChipClear?: Component<ChipClearProps, ChipClearOwnProps>;
  FieldClear?: Component<FieldClearProps, FieldClearOwnProps>;
  FieldToggle?: Component<FieldToggleProps, FieldToggleOwnProps>;
}

export type Required<T> = {
  [K in keyof T]-?: T[K];
};

export type InnerComponents<
  ChipOwnProps = any,
  ChipLabelOwnProps = any,
  ChipClearOwnProps = any,
  FieldClearOwnProps = any,
  FieldToggleOwnProps = any
> = Required<Components<
  ChipOwnProps,
  ChipLabelOwnProps,
  ChipClearOwnProps,
  FieldClearOwnProps,
  FieldToggleOwnProps
>>;
