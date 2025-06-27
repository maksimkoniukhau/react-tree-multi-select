import {Components, KeyboardConfig} from './types';

type Required<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends (...args: any[]) => any
      ? T[K] // skip functions
      : Required<T[K]>
    : T[K];
};

export type InnerKeyboardConfig = Required<KeyboardConfig>;

export type InnerComponents<
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
> = Required<Components<
  FieldCustomProps,
  ChipContainerCustomProps,
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
  NodeLabelCustomProps,
  FooterCustomProps,
  NoMatchesCustomProps
>>;
