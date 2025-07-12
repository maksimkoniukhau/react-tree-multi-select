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
 * Configuration options for keyboard behavior in the Field component.
 */
export type FieldKeyboardOptions = {
  /**
   * Enables looping when navigating left with the ArrowLeft key.
   * If `true`, pressing ArrowLeft on the first item will move focus to the last item.
   *
   * @default false
   */
  loopLeft?: boolean;

  /**
   * Enables looping when navigating right with the ArrowRight key.
   * If `true`, pressing ArrowRight on the last item will move focus to the first item.
   *
   * @default false
   */
  loopRight?: boolean;
};

/**
 * Configuration options for keyboard behavior in the Dropdown component.
 */
export type DropdownKeyboardOptions = {
  /**
   * Enables looping when navigating upward with the ArrowUp key.
   * If `true`, pressing ArrowUp on the first item will move focus to the last item.
   *
   * @default true
   */
  loopUp?: boolean;

  /**
   * Enables looping when navigating downward with the ArrowDown key.
   * If `true`, pressing ArrowDown on the last item will move focus to the first item.
   *
   * @default true
   */
  loopDown?: boolean;
};

/**
 * Controls keyboard navigation behavior for the component.
 */
export type KeyboardConfig = {
  /**
   * Configuration for the Field component (the selected items area).
   */
  field?: FieldKeyboardOptions;

  /**
   * Configuration for the Dropdown component (the available items list).
   */
  dropdown?: DropdownKeyboardOptions;
};

/**
 * Controls when the Footer component is rendered in the dropdown.
 */
export type FooterConfig = {
  /**
   * Renders the Footer when the component is in the search mode (when the input contains value).
   *
   * @default false
   */
  showWhenSearching?: boolean;
  /**
   * Renders the Footer when no items are available in the dropdown
   * (takes precedence over `showWhenSearching` if both apply).
   *
   * @default false
   */
  showWhenNoItems?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ComponentProps<CustomProps = unknown, OwnProps = unknown, ComponentType = unknown> {
  attributes: HTMLProps<ComponentType>;
  ownProps: OwnProps;
  customProps: CustomProps;
  children?: ReactNode;
}

export interface Component<CustomProps, ComponentProps> {
  component: ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = unknown> = ComponentProps<CustomProps, FieldOwnProps, HTMLDivElement>;
export type ChipContainerProps<CustomProps = unknown> = ComponentProps<CustomProps, ChipContainerOwnProps, HTMLDivElement>;
export type ChipLabelProps<CustomProps = unknown> = ComponentProps<CustomProps, ChipLabelOwnProps, HTMLDivElement>;
export type ChipClearProps<CustomProps = unknown> = ComponentProps<CustomProps, ChipClearOwnProps, HTMLDivElement>;
export type InputProps<CustomProps = unknown> = ComponentProps<CustomProps, InputOwnProps, HTMLInputElement>;
export type FieldClearProps<CustomProps = unknown> = ComponentProps<CustomProps, FieldClearOwnProps, HTMLDivElement>;
export type FieldToggleProps<CustomProps = unknown> = ComponentProps<CustomProps, FieldToggleOwnProps, HTMLDivElement>;
export type SelectAllContainerProps<CustomProps = unknown> = ComponentProps<CustomProps, SelectAllContainerOwnProps, HTMLDivElement>;
export type SelectAllCheckboxProps<CustomProps = unknown> = ComponentProps<CustomProps, SelectAllCheckboxOwnProps, HTMLDivElement>;
export type SelectAllLabelProps<CustomProps = unknown> = ComponentProps<CustomProps, SelectAllLabelOwnProps, HTMLDivElement>;
export type NodeContainerProps<CustomProps = unknown> = ComponentProps<CustomProps, NodeContainerOwnProps, HTMLDivElement>;
export type NodeToggleProps<CustomProps = unknown> = ComponentProps<CustomProps, NodeToggleOwnProps, HTMLDivElement>;
export type NodeCheckboxProps<CustomProps = unknown> = ComponentProps<CustomProps, NodeCheckboxOwnProps, HTMLDivElement>;
export type NodeLabelProps<CustomProps = unknown> = ComponentProps<CustomProps, NodeLabelOwnProps, HTMLDivElement>;
export type FooterProps<CustomProps = unknown> = ComponentProps<CustomProps, FooterOwnProps, HTMLDivElement>;
export type NoMatchesProps<CustomProps = unknown> = ComponentProps<CustomProps, NoMatchesOwnProps, HTMLDivElement>;

export type FieldType<CustomProps = unknown> = Component<CustomProps, FieldProps<CustomProps>>;
export type ChipContainerType<CustomProps = unknown> = Component<CustomProps, ChipContainerProps<CustomProps>>;
export type ChipLabelType<CustomProps = unknown> = Component<CustomProps, ChipLabelProps<CustomProps>>;
export type ChipClearType<CustomProps = unknown> = Component<CustomProps, ChipClearProps<CustomProps>>;
export type InputType<CustomProps = unknown> = Component<CustomProps, InputProps<CustomProps>>;
export type FieldClearType<CustomProps = unknown> = Component<CustomProps, FieldClearProps<CustomProps>>;
export type FieldToggleType<CustomProps = unknown> = Component<CustomProps, FieldToggleProps<CustomProps>>;
export type SelectAllContainerType<CustomProps = unknown> = Component<CustomProps, SelectAllContainerProps<CustomProps>>;
export type SelectAllCheckboxType<CustomProps = unknown> = Component<CustomProps, SelectAllCheckboxProps<CustomProps>>;
export type SelectAllLabelType<CustomProps = unknown> = Component<CustomProps, SelectAllLabelProps<CustomProps>>;
export type NodeContainerType<CustomProps = unknown> = Component<CustomProps, NodeContainerProps<CustomProps>>;
export type NodeToggleType<CustomProps = unknown> = Component<CustomProps, NodeToggleProps<CustomProps>>;
export type NodeCheckboxType<CustomProps = unknown> = Component<CustomProps, NodeCheckboxProps<CustomProps>>;
export type NodeLabelType<CustomProps = unknown> = Component<CustomProps, NodeLabelProps<CustomProps>>;
export type FooterType<CustomProps> = Component<CustomProps, FooterProps<CustomProps>>;
export type NoMatchesType<CustomProps = unknown> = Component<CustomProps, NoMatchesProps<CustomProps>>;

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
