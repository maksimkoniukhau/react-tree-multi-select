import {Components} from './types';
import {InnerComponents} from './innerTypes';
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

const components: InnerComponents = {
  Field: {
    component: Field
  },
  ChipContainer: {
    component: ChipContainer
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
  SelectAllContainer: {
    component: SelectAllContainer
  },
  SelectAllCheckbox: {
    component: SelectAllCheckbox
  },
  SelectAllLabel: {
    component: SelectAllLabel
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
  },
  NoMatches: {
    component: NoMatches
  }
};

export const getComponents = (propsComponents?: Components): InnerComponents => {
  return {...components, ...propsComponents};
};
