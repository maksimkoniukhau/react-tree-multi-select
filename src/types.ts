import {ComponentType, HTMLProps, ReactNode} from 'react';
import {FieldOwnProps} from './components/Field';
import {ChipContainerOwnProps} from './components/ChipContainer';
import {ChipLabelOwnProps} from './components/ChipLabel';
import {ChipClearOwnProps} from './components/ChipClear';
import {InputOwnProps} from './components/Input';
import {FieldClearOwnProps} from './components/FieldClear';
import {FieldToggleOwnProps} from './components/FieldToggle';
import {SelectAllContainerOwnProps} from './components/SelectAllContainer';
import {SelectAllCheckboxOwnProps} from './components/SelectAllCheckbox';
import {SelectAllLabelOwnProps} from './components/SelectAllLabel';
import {NodeContainerOwnProps} from './components/NodeContainer';
import {NodeToggleOwnProps} from './components/NodeToggle';
import {NodeCheckboxOwnProps} from './components/NodeCheckbox';
import {NodeLabelOwnProps} from './components/NodeLabel';
import {FooterOwnProps} from './components/Footer';
import {NoMatchesOwnProps} from './components/NoMatches';

export enum Type {
  TREE_SELECT = 'TREE_SELECT',
  TREE_SELECT_FLAT = 'TREE_SELECT_FLAT',
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

/**
 * Controls when the Footer component is rendered in the dropdown.
 *
 * @property showWhenSearching - Renders the Footer when the component is in search mode
 *                                (when the input contains value).
 * @property showWhenNoItems - renders the Footer when no items are available in the dropdown
 *                              (takes precedence over `showWhenSearching` if both apply).
 */
export type FooterConfig = {
  showWhenSearching?: boolean;
  showWhenNoItems?: boolean;
}

export interface ComponentProps<CustomProps = {}, OwnProps = {}, ComponentType = {}> {
  attributes: HTMLProps<ComponentType>;
  ownProps: OwnProps;
  customProps: CustomProps;
  children?: ReactNode;
}

export interface Component<CustomProps, ComponentProps> {
  component: ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = {}> = ComponentProps<CustomProps, FieldOwnProps, HTMLDivElement>;
export type ChipContainerProps<CustomProps = {}> = ComponentProps<CustomProps, ChipContainerOwnProps, HTMLDivElement>;
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
export type FooterProps<CustomProps = {}> = ComponentProps<CustomProps, FooterOwnProps, HTMLDivElement>;
export type NoMatchesProps<CustomProps = {}> = ComponentProps<CustomProps, NoMatchesOwnProps, HTMLDivElement>;

export type FieldType<CustomProps = {}> = Component<CustomProps, FieldProps<CustomProps>>;
export type ChipContainerType<CustomProps = {}> = Component<CustomProps, ChipContainerProps<CustomProps>>;
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
export type FooterType<CustomProps = {}> = Component<CustomProps, FooterProps<CustomProps>>;
export type NoMatchesType<CustomProps = {}> = Component<CustomProps, NoMatchesProps<CustomProps>>;

export interface Components<
  FieldCustomProps = any,
  ChipContainerCustomProps = any,
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
  NodeLabelCustomProps = any,
  FooterCustomProps = any,
  NoMatchesCustomProps = any
> {
  Field?: FieldType<FieldCustomProps>;
  ChipContainer?: ChipContainerType<ChipContainerCustomProps>;
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
  Footer?: FooterType<FooterCustomProps>;
  NoMatches?: NoMatchesType<NoMatchesCustomProps>;
}
