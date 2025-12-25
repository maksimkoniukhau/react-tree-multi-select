import React, {JSX} from 'react';
import {CheckedState, Type} from './core';

export interface FieldOwnProps {
  type: Type;
  isDropdownOpen: boolean;
  withClearAll: boolean;
  componentDisabled: boolean;
}

export interface ChipContainerOwnProps {
  label: string;
  focused: boolean;
  disabled: boolean;
  componentDisabled: boolean;
  withChipClear: boolean;
}

export interface ChipLabelOwnProps {
  label: string;
  componentDisabled: boolean;
}

export interface ChipClearOwnProps {
  componentDisabled: boolean;
}

export interface InputOwnProps {
  placeholder: string;
  value: string;
  disabled: boolean;
}

export interface FieldClearOwnProps {
  focused: boolean;
  componentDisabled: boolean;
}

export interface FieldToggleOwnProps {
  expanded: boolean;
  componentDisabled: boolean;
}

export interface DropdownOwnProps {
  componentDisabled: boolean;
}

export interface SelectAllContainerOwnProps {
  label: string;
  checkedState: CheckedState;
  focused: boolean;
}

export interface SelectAllCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
}

export interface SelectAllLabelOwnProps {
  label: string;
}

export interface NodeContainerOwnProps {
  label: string;
  disabled: boolean;
  selected: boolean;
  partial: boolean;
  expanded: boolean;
  focused: boolean;
  matched: boolean;
}

export interface NodeToggleOwnProps {
  expanded: boolean;
}

export interface NodeCheckboxOwnProps {
  checked: boolean;
  partial: boolean;
  disabled: boolean;
}

export interface NodeLabelOwnProps {
  label: string;
}

export interface FooterOwnProps {
  focused: boolean;
}

export interface NoDataOwnProps {
  label: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface SpinnerOwnProps {
}

export type Attributes<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag] & {
  'data-rtms-virtual-focus-id'?: string;
};

export interface ComponentProps<Tag extends keyof JSX.IntrinsicElements, OwnProps, CustomProps = unknown> {
  attributes: Attributes<Tag>;
  ownProps: OwnProps;
  customProps: CustomProps;
  children?: React.ReactNode;
}

export interface Component<ComponentProps, CustomProps = unknown> {
  component: React.ComponentType<ComponentProps>;
  props?: CustomProps;
}

export type FieldProps<CustomProps = unknown> = ComponentProps<'div', FieldOwnProps, CustomProps>;
export type ChipContainerProps<CustomProps = unknown> = ComponentProps<'div', ChipContainerOwnProps, CustomProps>;
export type ChipLabelProps<CustomProps = unknown> = ComponentProps<'div', ChipLabelOwnProps, CustomProps>;
export type ChipClearProps<CustomProps = unknown> = ComponentProps<'div', ChipClearOwnProps, CustomProps>;
export type InputProps<CustomProps = unknown> = ComponentProps<'input', InputOwnProps, CustomProps>;
export type FieldClearProps<CustomProps = unknown> = ComponentProps<'div', FieldClearOwnProps, CustomProps>;
export type FieldToggleProps<CustomProps = unknown> = ComponentProps<'div', FieldToggleOwnProps, CustomProps>;
export type DropdownProps<CustomProps = unknown> = ComponentProps<'div', DropdownOwnProps, CustomProps>;
export type SelectAllContainerProps<CustomProps = unknown> = ComponentProps<'div', SelectAllContainerOwnProps, CustomProps>;
export type SelectAllCheckboxProps<CustomProps = unknown> = ComponentProps<'div', SelectAllCheckboxOwnProps, CustomProps>;
export type SelectAllLabelProps<CustomProps = unknown> = ComponentProps<'div', SelectAllLabelOwnProps, CustomProps>;
export type NodeContainerProps<CustomProps = unknown> = ComponentProps<'div', NodeContainerOwnProps, CustomProps>;
export type NodeToggleProps<CustomProps = unknown> = ComponentProps<'div', NodeToggleOwnProps, CustomProps>;
export type NodeCheckboxProps<CustomProps = unknown> = ComponentProps<'div', NodeCheckboxOwnProps, CustomProps>;
export type NodeLabelProps<CustomProps = unknown> = ComponentProps<'div', NodeLabelOwnProps, CustomProps>;
export type FooterProps<CustomProps = unknown> = ComponentProps<'div', FooterOwnProps, CustomProps>;
export type NoDataProps<CustomProps = unknown> = ComponentProps<'div', NoDataOwnProps, CustomProps>;
export type SpinnerProps<CustomProps = unknown> = ComponentProps<'div', SpinnerOwnProps, CustomProps>;

export type FieldType<CustomProps = unknown> = Component<FieldProps<CustomProps>, CustomProps>;
export type ChipContainerType<CustomProps = unknown> = Component<ChipContainerProps<CustomProps>, CustomProps>;
export type ChipLabelType<CustomProps = unknown> = Component<ChipLabelProps<CustomProps>, CustomProps>;
export type ChipClearType<CustomProps = unknown> = Component<ChipClearProps<CustomProps>, CustomProps>;
export type InputType<CustomProps = unknown> = Component<InputProps<CustomProps>, CustomProps>;
export type FieldClearType<CustomProps = unknown> = Component<FieldClearProps<CustomProps>, CustomProps>;
export type FieldToggleType<CustomProps = unknown> = Component<FieldToggleProps<CustomProps>, CustomProps>;
export type DropdownType<CustomProps = unknown> = Component<DropdownProps<CustomProps>, CustomProps>;
export type SelectAllContainerType<CustomProps = unknown> = Component<SelectAllContainerProps<CustomProps>, CustomProps>;
export type SelectAllCheckboxType<CustomProps = unknown> = Component<SelectAllCheckboxProps<CustomProps>, CustomProps>;
export type SelectAllLabelType<CustomProps = unknown> = Component<SelectAllLabelProps<CustomProps>, CustomProps>;
export type NodeContainerType<CustomProps = unknown> = Component<NodeContainerProps<CustomProps>, CustomProps>;
export type NodeToggleType<CustomProps = unknown> = Component<NodeToggleProps<CustomProps>, CustomProps>;
export type NodeCheckboxType<CustomProps = unknown> = Component<NodeCheckboxProps<CustomProps>, CustomProps>;
export type NodeLabelType<CustomProps = unknown> = Component<NodeLabelProps<CustomProps>, CustomProps>;
export type FooterType<CustomProps = unknown> = Component<FooterProps<CustomProps>, CustomProps>;
export type NoDataType<CustomProps = unknown> = Component<NoDataProps<CustomProps>, CustomProps>;
export type SpinnerType<CustomProps = unknown> = Component<SpinnerProps<CustomProps>, CustomProps>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ComponentTypes = {
  Field: FieldType<any>;
  ChipContainer: ChipContainerType<any>;
  ChipLabel: ChipLabelType<any>;
  ChipClear: ChipClearType<any>;
  Input: InputType<any>;
  FieldClear: FieldClearType<any>;
  FieldToggle: FieldToggleType<any>;
  Dropdown: DropdownType<any>;
  SelectAllContainer: SelectAllContainerType<any>;
  SelectAllCheckbox: SelectAllCheckboxType<any>;
  SelectAllLabel: SelectAllLabelType<any>;
  NodeContainer: NodeContainerType<any>;
  NodeToggle: NodeToggleType<any>;
  NodeCheckbox: NodeCheckboxType<any>;
  NodeLabel: NodeLabelType<any>;
  Footer: FooterType<any>;
  NoData: NoDataType<any>;
  Spinner: SpinnerType<any>;
};

export type ComponentNames = keyof ComponentTypes;

export type Components<
  ComponentsMap extends Partial<ComponentTypes>
    & Record<Exclude<keyof ComponentsMap, ComponentNames>, never> = any
> = {
  [K in ComponentNames]?: Component<
    ComponentTypes[K] extends Component<infer ComponentProps, any> ? ComponentProps : never,
    K extends keyof ComponentsMap
      ? ComponentsMap[K] extends Component<any, infer CustomProps>
        ? CustomProps
        : unknown
      : unknown
  >;
};
