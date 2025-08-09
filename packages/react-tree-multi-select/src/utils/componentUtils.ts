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
      loopLeft: field.loopLeft ?? false,
      loopRight: field.loopRight ?? false
    },
    dropdown: {
      loopUp: dropdown.loopUp ?? true,
      loopDown: dropdown.loopDown ?? true
    }
  };
};

export const shouldRenderSelectAll = (
  type: Type, displayedNodes: Node[], isSearchMode: boolean, withSelectAll: boolean
): boolean => {
  return type !== Type.SELECT && displayedNodes?.length > 0 && !isSearchMode && withSelectAll;
};
