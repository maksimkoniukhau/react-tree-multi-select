import {KeyboardConfig, Type} from '../types';
import {InnerKeyboardConfig} from '../innerTypes';

export const typeToClassName = (type: Type): string => {
  return `rtms-${type.toLowerCase().replaceAll('_', '-')}-type`;
};

export const getKeyboardConfig = (propsKeyboardConfig: KeyboardConfig = {}): InnerKeyboardConfig => {
  const {field = {}, dropdown = {}} = propsKeyboardConfig;
  return {
    field: {
      loopNavigation: field.loopNavigation ?? false,
    },
    dropdown: {
      loopNavigation: dropdown.loopNavigation ?? true,
    },
  };
};
