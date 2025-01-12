import {Components, InnerComponents} from './models';
import {Field} from './Field';
import {Input} from './Input';
import {Chip} from './Chip';
import {ChipLabel} from './ChipLabel';
import {ChipClear} from './ChipClear';
import {FieldClear} from './FieldClear';
import {FieldToggle} from './FieldToggle';

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
  }
};

export const getComponents = (propsComponents?: Components): InnerComponents => {
  return {...components, ...propsComponents};
};
