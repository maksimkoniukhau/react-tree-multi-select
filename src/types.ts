import {ComponentType, HTMLProps, ReactNode} from 'react';

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

export interface FieldOwnProps {
  type: Type;
  showDropdown: boolean;
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

export interface NoMatchesOwnProps {
  label: string;
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
export type ComponentTypes = {
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
