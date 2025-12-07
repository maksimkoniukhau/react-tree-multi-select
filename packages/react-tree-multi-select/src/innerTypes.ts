import {Components, KeyboardConfig, VirtualFocusId} from './types';

type Required<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends (...args: unknown[]) => unknown
      ? T[K] // skip functions
      : Required<T[K]>
    : T[K];
};

export type InnerKeyboardConfig = Required<KeyboardConfig>;

export type InnerComponents = Required<Components>;

export type NullableVirtualFocusId = VirtualFocusId | null;

export interface SelectionState {
  selectedIds: Set<string>;
  // Node is effectively selected when all not disabled descendants are selected
  effectivelySelectedIds: Set<string>;
  partiallySelectedIds: Set<string>;
  someDescendantSelectedIds: Set<string>;
}
