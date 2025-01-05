import {Components, InnerComponents} from './models';
import {ChipClear} from './ChipClear';
import {ChipLabel} from './ChipLabel';
import {Chip} from './Chip';

const components: InnerComponents = {
  Chip: {
    component: Chip
  },
  ChipClear: {
    component: ChipClear
  },
  ChipLabel: {
    component: ChipLabel
  }
};

export const getComponents = (propsComponents?: Components): InnerComponents => {
  return {...components, ...propsComponents};
};
