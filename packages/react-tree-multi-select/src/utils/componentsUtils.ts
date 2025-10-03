import {ComponentType} from 'react';
import {Components, FooterProps} from '../types';
import {InnerComponents} from '../innerTypes';
import {Field} from '../components/Field';
import {ChipContainer} from '../components/ChipContainer';
import {ChipLabel} from '../components/ChipLabel';
import {ChipClear} from '../components/ChipClear';
import {Input} from '../components/Input';
import {FieldClear} from '../components/FieldClear';
import {FieldToggle} from '../components/FieldToggle';
import {Dropdown} from '../DropdownContainer';
import {SelectAllContainer} from '../components/SelectAllContainer';
import {SelectAllCheckbox} from '../components/SelectAllCheckbox';
import {SelectAllLabel} from '../components/SelectAllLabel';
import {NodeContainer} from '../components/NodeContainer';
import {NodeToggle} from '../components/NodeToggle';
import {NodeCheckbox} from '../components/NodeCheckbox';
import {NodeLabel} from '../components/NodeLabel';
import {Footer} from '../components/Footer';
import {NoData} from '../components/NoData';

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
  Dropdown: {
    component: Dropdown
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
  Footer: {
    component: Footer
  },
  NoData: {
    component: NoData
  }
};

export const getComponents = (propsComponents: Components = {}): InnerComponents => {
  return {
    ...components,
    ...propsComponents,
    Footer: propsComponents.Footer ?? {component: Footer}
  };
};

export const hasCustomFooterComponent = (footerComponent: ComponentType<FooterProps>): boolean => {
  return footerComponent !== Footer;
};
