import {Components, InnerComponents} from './models';
import {Field} from './Field';
import {Chip} from './Chip';
import {ChipLabel} from './ChipLabel';
import {ChipClear} from './ChipClear';
import {Input} from './Input';
import {FieldClear} from './FieldClear';
import {FieldToggle} from './FieldToggle';
import {NodeContainer} from './NodeContainer';
import {NodeToggle} from './NodeToggle';
import {NodeCheckbox} from './NodeCheckbox';
import {NodeLabel} from './NodeLabel';

const components: InnerComponents = {
  Field: {
    component: Field
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
  Input: {
    component: Input
  },
  FieldClear: {
    component: FieldClear
  },
  FieldToggle: {
    component: FieldToggle
  },
  NodeContainer: {
    component: NodeContainer
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
