import {ComponentType, HTMLProps, ReactNode} from 'react';
import {FieldOwnProps} from './Field';
import {ChipOwnProps} from './Chip';
import {ChipLabelOwnProps} from './ChipLabel';
import {ChipClearOwnProps} from './ChipClear';
import {InputOwnProps} from './Input';
import {FieldClearOwnProps} from './FieldClear';
import {FieldToggleOwnProps} from './FieldToggle';
import {SelectAllContainerOwnProps} from './SelectAllContainer';
import {SelectAllCheckboxOwnProps} from './SelectAllCheckbox';
import {SelectAllLabelOwnProps} from './SelectAllLabel';
import {NodeContainerOwnProps} from './NodeContainer';
import {NodeToggleOwnProps} from './NodeToggle';
import {NodeCheckboxOwnProps} from './NodeCheckbox';
import {NodeLabelOwnProps} from './NodeLabel';

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

export interface ComponentProps<CustomProps = {}, OwnProps = {}, ComponentType = {}> {
  componentAttributes: HTMLProps<ComponentType>;
  componentProps: OwnProps;
  customProps: CustomProps;
  children?: ReactNode;
}

export interface Component<CustomProps, ComponentProps> {
  component: ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = {}> = ComponentProps<CustomProps, FieldOwnProps, HTMLDivElement>;
export type ChipProps<CustomProps = {}> = ComponentProps<CustomProps, ChipOwnProps, HTMLDivElement>;
export type ChipLabelProps<CustomProps = {}> = ComponentProps<CustomProps, ChipLabelOwnProps, HTMLDivElement>;
export type ChipClearProps<CustomProps = {}> = ComponentProps<CustomProps, ChipClearOwnProps, HTMLDivElement>;
export type InputProps<CustomProps = {}> = ComponentProps<CustomProps, InputOwnProps, HTMLInputElement>;
export type FieldClearProps<CustomProps = {}> = ComponentProps<CustomProps, FieldClearOwnProps, HTMLDivElement>;
export type FieldToggleProps<CustomProps = {}> = ComponentProps<CustomProps, FieldToggleOwnProps, HTMLDivElement>;
export type SelectAllContainerProps<CustomProps = {}> = ComponentProps<CustomProps, SelectAllContainerOwnProps, HTMLDivElement>;
export type SelectAllCheckboxProps<CustomProps = {}> = ComponentProps<CustomProps, SelectAllCheckboxOwnProps, HTMLDivElement>;
export type SelectAllLabelProps<CustomProps = {}> = ComponentProps<CustomProps, SelectAllLabelOwnProps, HTMLDivElement>;
export type NodeContainerProps<CustomProps = {}> = ComponentProps<CustomProps, NodeContainerOwnProps, HTMLDivElement>;
export type NodeToggleProps<CustomProps = {}> = ComponentProps<CustomProps, NodeToggleOwnProps, HTMLDivElement>;
export type NodeCheckboxProps<CustomProps = {}> = ComponentProps<CustomProps, NodeCheckboxOwnProps, HTMLDivElement>;
export type NodeLabelProps<CustomProps = {}> = ComponentProps<CustomProps, NodeLabelOwnProps, HTMLDivElement>;

export type FieldType<CustomProps = {}> = Component<CustomProps, FieldProps<CustomProps>>;
export type ChipType<CustomProps = {}> = Component<CustomProps, ChipProps<CustomProps>>;
export type ChipLabelType<CustomProps = {}> = Component<CustomProps, ChipLabelProps<CustomProps>>;
export type ChipClearType<CustomProps = {}> = Component<CustomProps, ChipClearProps<CustomProps>>;
export type InputType<CustomProps = {}> = Component<CustomProps, InputProps<CustomProps>>;
export type FieldClearType<CustomProps = {}> = Component<CustomProps, FieldClearProps<CustomProps>>;
export type FieldToggleType<CustomProps = {}> = Component<CustomProps, FieldToggleProps<CustomProps>>;
export type SelectAllContainerType<CustomProps = {}> = Component<CustomProps, SelectAllContainerProps<CustomProps>>;
export type SelectAllCheckboxType<CustomProps = {}> = Component<CustomProps, SelectAllCheckboxProps<CustomProps>>;
export type SelectAllLabelType<CustomProps = {}> = Component<CustomProps, SelectAllLabelProps<CustomProps>>;
export type NodeContainerType<CustomProps = {}> = Component<CustomProps, NodeContainerProps<CustomProps>>;
export type NodeToggleType<CustomProps = {}> = Component<CustomProps, NodeToggleProps<CustomProps>>;
export type NodeCheckboxType<CustomProps = {}> = Component<CustomProps, NodeCheckboxProps<CustomProps>>;
export type NodeLabelType<CustomProps = {}> = Component<CustomProps, NodeLabelProps<CustomProps>>;


export interface Components<
  FieldCustomProps = any,
  ChipCustomProps = any,
  ChipLabelCustomProps = any,
  ChipClearCustomProps = any,
  InputCustomProps = any,
  FieldClearCustomProps = any,
  FieldToggleCustomProps = any,
  SelectAllContainerCustomProps = any,
  SelectAllCheckboxCustomProps = any,
  SelectAllLabelCustomProps = any,
  NodeContainerCustomProps = any,
  NodeToggleCustomProps = any,
  NodeCheckboxCustomProps = any,
  NodeLabelCustomProps = any
> {
  Field?: FieldType<FieldCustomProps>;
  Chip?: ChipType<ChipCustomProps>;
  ChipLabel?: ChipLabelType<ChipLabelCustomProps>;
  ChipClear?: ChipClearType<ChipClearCustomProps>;
  Input?: InputType<InputCustomProps>;
  FieldClear?: FieldClearType<FieldClearCustomProps>;
  FieldToggle?: FieldToggleType<FieldToggleCustomProps>;
  SelectAllContainer?: SelectAllContainerType<SelectAllContainerCustomProps>;
  SelectAllCheckbox?: SelectAllCheckboxType<SelectAllCheckboxCustomProps>;
  SelectAllLabel?: SelectAllLabelType<SelectAllLabelCustomProps>;
  NodeContainer?: NodeContainerType<NodeContainerCustomProps>;
  NodeToggle?: NodeToggleType<NodeToggleCustomProps>;
  NodeCheckbox?: NodeCheckboxType<NodeCheckboxCustomProps>;
  NodeLabel?: NodeLabelType<NodeLabelCustomProps>;
}

export type Required<T> = {
  [K in keyof T]-?: T[K];
};

export type InnerComponents<
  FieldCustomProps = any,
  ChipCustomProps = any,
  ChipLabelCustomProps = any,
  ChipClearCustomProps = any,
  InputCustomProps = any,
  FieldClearCustomProps = any,
  FieldToggleCustomProps = any,
  SelectAllContainerCustomProps = any,
  SelectAllCheckboxCustomProps = any,
  SelectAllLabelCustomProps = any,
  NodeContainerCustomProps = any,
  NodeToggleCustomProps = any,
  NodeCheckboxCustomProps = any,
  NodeLabelCustomProps = any
> = Required<Components<
  FieldCustomProps,
  ChipCustomProps,
  ChipLabelCustomProps,
  ChipClearCustomProps,
  InputCustomProps,
  FieldClearCustomProps,
  FieldToggleCustomProps,
  SelectAllContainerCustomProps,
  SelectAllCheckboxCustomProps,
  SelectAllLabelCustomProps,
  NodeContainerCustomProps,
  NodeToggleCustomProps,
  NodeCheckboxCustomProps,
  NodeLabelCustomProps
>>;
