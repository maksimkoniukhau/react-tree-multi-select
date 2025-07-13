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

export interface ComponentProps<ComponentType, OwnProps, CustomProps = unknown> {
  attributes: HTMLProps<ComponentType>;
  ownProps: OwnProps;
  customProps: CustomProps;
  children?: ReactNode;
}

export interface Component<ComponentProps, CustomProps = unknown> {
  component: ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FieldOwnProps, CustomProps>;
export type ChipContainerProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, ChipContainerOwnProps, CustomProps>;
export type ChipLabelProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, ChipLabelOwnProps, CustomProps>;
export type ChipClearProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, ChipClearOwnProps, CustomProps>;
export type InputProps<CustomProps = unknown> = ComponentProps<HTMLInputElement, InputOwnProps, CustomProps>;
export type FieldClearProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FieldClearOwnProps, CustomProps>;
export type FieldToggleProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FieldToggleOwnProps, CustomProps>;
export type SelectAllContainerProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, SelectAllContainerOwnProps, CustomProps>;
export type SelectAllCheckboxProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, SelectAllCheckboxOwnProps, CustomProps>;
export type SelectAllLabelProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, SelectAllLabelOwnProps, CustomProps>;
export type NodeContainerProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeContainerOwnProps, CustomProps>;
export type NodeToggleProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeToggleOwnProps, CustomProps>;
export type NodeCheckboxProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeCheckboxOwnProps, CustomProps>;
export type NodeLabelProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NodeLabelOwnProps, CustomProps>;
export type FooterProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, FooterOwnProps, CustomProps>;
export type NoMatchesProps<CustomProps = unknown> = ComponentProps<HTMLDivElement, NoMatchesOwnProps, CustomProps>;

export type FieldType<CustomProps = unknown> = Component<FieldProps<CustomProps>, CustomProps>;
export type ChipContainerType<CustomProps = unknown> = Component<ChipContainerProps<CustomProps>, CustomProps>;
export type ChipLabelType<CustomProps = unknown> = Component<ChipLabelProps<CustomProps>, CustomProps>;
export type ChipClearType<CustomProps = unknown> = Component<ChipClearProps<CustomProps>, CustomProps>;
export type InputType<CustomProps = unknown> = Component<InputProps<CustomProps>, CustomProps>;
export type FieldClearType<CustomProps = unknown> = Component<FieldClearProps<CustomProps>, CustomProps>;
export type FieldToggleType<CustomProps = unknown> = Component<FieldToggleProps<CustomProps>, CustomProps>;
export type SelectAllContainerType<CustomProps = unknown> = Component<SelectAllContainerProps<CustomProps>, CustomProps>;
export type SelectAllCheckboxType<CustomProps = unknown> = Component<SelectAllCheckboxProps<CustomProps>, CustomProps>;
export type SelectAllLabelType<CustomProps = unknown> = Component<SelectAllLabelProps<CustomProps>, CustomProps>;
export type NodeContainerType<CustomProps = unknown> = Component<NodeContainerProps<CustomProps>, CustomProps>;
export type NodeToggleType<CustomProps = unknown> = Component<NodeToggleProps<CustomProps>, CustomProps>;
export type NodeCheckboxType<CustomProps = unknown> = Component<NodeCheckboxProps<CustomProps>, CustomProps>;
export type NodeLabelType<CustomProps = unknown> = Component<NodeLabelProps<CustomProps>, CustomProps>;
export type FooterType<CustomProps = unknown> = Component<FooterProps<CustomProps>, CustomProps>;
export type NoMatchesType<CustomProps = unknown> = Component<NoMatchesProps<CustomProps>, CustomProps>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ComponentPropTypes = {
  Field: FieldType<any>;
  ChipContainer: ChipContainerType<any>;
  ChipLabel: ChipLabelType<any>;
  ChipClear: ChipClearType<any>;
  Input: InputType<any>;
  FieldClear: FieldClearType<any>;
  FieldToggle: FieldToggleType<any>;
  SelectAllContainer: SelectAllContainerType<any>;
  SelectAllCheckbox: SelectAllCheckboxType<any>;
  SelectAllLabel: SelectAllLabelType<any>;
  NodeContainer: NodeContainerType<any>;
  NodeToggle: NodeToggleType<any>;
  NodeCheckbox: NodeCheckboxType<any>;
  NodeLabel: NodeLabelType<any>;
  Footer: FooterType<any>;
  NoMatches: NoMatchesType<any>;
};

export type ComponentNames = keyof ComponentPropTypes;

export type Components<
  ComponentsMap extends Partial<ComponentPropTypes>
    & Record<Exclude<keyof ComponentsMap, ComponentNames>, never> = any
> = {
  [K in ComponentNames]?: Component<
    ComponentPropTypes[K] extends Component<infer ComponentProps, any> ? ComponentProps : never,
    K extends keyof ComponentsMap
      ? ComponentsMap[K] extends Component<any, infer CustomProps>
        ? CustomProps
        : unknown
      : unknown
  >;
};
