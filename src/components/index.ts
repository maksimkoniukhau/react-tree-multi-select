import {FC} from 'react';
import {
  ChipClearProps,
  ChipContainerProps,
  ChipLabelProps,
  FieldClearProps,
  FieldProps,
  FieldToggleProps,
  InputProps,
  NodeCheckboxProps,
  NodeContainerProps,
  NodeLabelProps,
  NodeToggleProps,
  NoMatchesProps,
  SelectAllCheckboxProps,
  SelectAllContainerProps,
  SelectAllLabelProps
} from '../types';
import {Field} from './Field';
import {ChipContainer} from './ChipContainer';
import {ChipLabel} from './ChipLabel';
import {ChipClear} from './ChipClear';
import {Input} from './Input';
import {FieldClear} from './FieldClear';
import {FieldToggle} from './FieldToggle';
import {SelectAllContainer} from './SelectAllContainer';
import {SelectAllCheckbox} from './SelectAllCheckbox';
import {SelectAllLabel} from './SelectAllLabel';
import {NodeContainer} from './NodeContainer';
import {NodeToggle} from './NodeToggle';
import {NodeCheckbox} from './NodeCheckbox';
import {NodeLabel} from './NodeLabel';
import {NoMatches} from './NoMatches';

export interface ComponentsType {
  Field: FC<FieldProps>;
  ChipContainer: FC<ChipContainerProps>;
  ChipLabel: FC<ChipLabelProps>;
  ChipClear: FC<ChipClearProps>;
  Input: FC<InputProps>;
  FieldClear: FC<FieldClearProps>;
  FieldToggle: FC<FieldToggleProps>;
  SelectAllContainer: FC<SelectAllContainerProps>;
  SelectAllCheckbox: FC<SelectAllCheckboxProps>;
  SelectAllLabel: FC<SelectAllLabelProps>;
  NodeContainer: FC<NodeContainerProps>;
  NodeToggle: FC<NodeToggleProps>;
  NodeCheckbox: FC<NodeCheckboxProps>;
  NodeLabel: FC<NodeLabelProps>;
  NoMatches: FC<NoMatchesProps>;
}

export const components: ComponentsType = {
  Field,
  ChipContainer,
  ChipLabel,
  ChipClear,
  Input,
  FieldClear,
  FieldToggle,
  SelectAllContainer,
  SelectAllCheckbox,
  SelectAllLabel,
  NodeContainer,
  NodeToggle,
  NodeCheckbox,
  NodeLabel,
  NoMatches
};
