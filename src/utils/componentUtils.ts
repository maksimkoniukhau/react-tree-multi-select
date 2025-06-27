import {KeyboardConfig, Type} from '../types';
import {InnerKeyboardConfig} from '../innerTypes';
import {Node} from '../Node';

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

export const shouldRenderSelectAll = (
  type: Type, displayedNodes: Node[], isSearchMode: boolean, withSelectAll: boolean
): boolean => {
  return type !== Type.SELECT && displayedNodes?.length > 0 && !isSearchMode && withSelectAll;
};
