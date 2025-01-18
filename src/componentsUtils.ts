import {Components, InnerComponents} from './models';
import {Field} from './Field';
import {Input} from './Input';
import {Chip} from './Chip';
import {ChipLabel} from './ChipLabel';
import {ChipClear} from './ChipClear';
import {FieldClear} from './FieldClear';
import {FieldToggle} from './FieldToggle';
import {NodeToggle} from './NodeToggle';
import {NodeCheckbox} from './NodeCheckbox';
import {NodeLabel} from './NodeLabel';

const components: InnerComponents = {
  Field: {
    component: Field
  },
  Input: {
    component: Input
  },
  Chip: {
    component: Chip
  },
  ChipLabel: {
    component: ChipLabel
  },
  ChipClear: {
    component: ChipClear
  },
  FieldClear: {
    component: FieldClear
  },
  FieldToggle: {
    component: FieldToggle
  },
  NodeToggle: {
    component: NodeToggle
  },
  NodeCheckbox: {
    component: NodeCheckbox
  },
  NodeLabel: {
    component: NodeLabel
  }
};

export const getComponents = (propsComponents?: Components): InnerComponents => {
  return {...components, ...propsComponents};
};
