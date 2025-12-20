'use client'

import React, {FC, useRef, useState} from 'react';
import {
  CLEAR_ALL_SUFFIX,
  DROPDOWN_PREFIX,
  FIELD_PREFIX,
  INPUT_SUFFIX,
  SELECT_ALL_SUFFIX,
  TreeMultiSelect,
  TreeMultiSelectHandle,
  TreeNode,
  VirtualFocusId
} from 'react-tree-multi-select';
import {getBaseExpandedIds, getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const KeyboardNavigationSimulatorExample: FC = () => {

  const rtmsRef = useRef<TreeMultiSelectHandle>(null);

  const [data] = useState<TreeNode[]>(getTreeNodeData(true));
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());
  const [expandedIds] = useState<string[]>(getBaseExpandedIds());

  const buildVirtualFocusId = (
    region: typeof FIELD_PREFIX | typeof DROPDOWN_PREFIX,
    elementId: string
  ): VirtualFocusId => {
    return `${region}${elementId}`;
  };

  const extractElementId = (virtualFocusId: VirtualFocusId | null): string => {
    return virtualFocusId?.replace(FIELD_PREFIX, '').replace(DROPDOWN_PREFIX, '') ?? '';
  };

  const isVirtualFocusInField = (virtualFocusId: VirtualFocusId | null): boolean => {
    return virtualFocusId?.startsWith(FIELD_PREFIX) ?? false;
  };

  const isVirtualFocusInDropdown = (virtualFocusId: VirtualFocusId | null): boolean => {
    return virtualFocusId?.startsWith(DROPDOWN_PREFIX) ?? false;
  };

  const withDropdownInput = false;

  const handleKeyDown = (event: React.KeyboardEvent): boolean | undefined => {
    const rtmsAPI = rtmsRef.current;
    if (!rtmsAPI) {
      return;
    }
    const {inputValue, isDropdownOpen, virtualFocusId} = rtmsAPI.getState();
    switch (event.key) {
      case 'ArrowLeft':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          rtmsAPI.collapseNode();
          if (inputValue) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
        } else {
          if (!inputValue || (withDropdownInput && !isDropdownOpen)) {
            rtmsAPI.focusPrevItem();
          }
        }
        return true;
      case 'ArrowRight':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          rtmsAPI.expandNode();
          if (inputValue) {
            event.preventDefault(); // Prevent the caret from moving inside the input.
          }
        } else {
          if (!inputValue || (withDropdownInput && !isDropdownOpen)) {
            rtmsAPI.focusNextItem();
          }
        }
        return true;
      case 'ArrowUp':
        if (isDropdownOpen && isVirtualFocusInDropdown(virtualFocusId)) {
          rtmsAPI.focusPrevItem();
        } else {
          rtmsAPI.toggleDropdown();
        }
        event.preventDefault();
        return true;
      case 'ArrowDown':
        if (isDropdownOpen) {
          if (isVirtualFocusInDropdown(virtualFocusId)) {
            rtmsAPI.focusNextItem();
          } else {
            rtmsAPI.focusFirstItem('dropdown:');
          }
        } else {
          rtmsAPI.openDropdown();
        }
        event.preventDefault();
        return true;
      case 'Home':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          rtmsAPI.focusFirstItem();
          event.preventDefault();
        } else {
          if (!inputValue || (withDropdownInput && !isDropdownOpen)) {
            rtmsAPI.focusFirstItem();
            event.preventDefault();
          }
        }
        return true;
      case 'End':
        if (isVirtualFocusInDropdown(virtualFocusId)) {
          rtmsAPI.focusLastItem();
          event.preventDefault();
        } else {
          if (!inputValue || (withDropdownInput && !isDropdownOpen)) {
            rtmsAPI.focusLastItem();
            event.preventDefault();
          }
        }
        return true;
      case 'Enter':
        if (!virtualFocusId || isVirtualFocusInField(virtualFocusId)) {
          rtmsAPI.toggleDropdown();
          if (!(!virtualFocusId
            || buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX) === virtualFocusId
            || buildVirtualFocusId(FIELD_PREFIX, CLEAR_ALL_SUFFIX) === virtualFocusId)) {
            // chip is focused. any action can be performed
          }
        } else {
          if (buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX) === virtualFocusId) {
            rtmsAPI.toggleAllSelection();
          } else {
            rtmsAPI.toggleNodeSelection();
          }
        }
        event.preventDefault();
        return true;
      case 'Backspace':
        if (!inputValue && isVirtualFocusInField(virtualFocusId)
          && buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX) !== virtualFocusId) {
          if (buildVirtualFocusId(FIELD_PREFIX, CLEAR_ALL_SUFFIX) === virtualFocusId) {
            rtmsAPI.deselectAll();
          } else {
            rtmsAPI.deselectNode();
            if (!rtmsAPI.getById(extractElementId(virtualFocusId))?.disabled) {
              rtmsAPI.focusPrevItem();
            }
          }
          event.preventDefault();
        }
        return true;
      case 'Escape':
        if (isDropdownOpen) {
          rtmsAPI.closeDropdown();
          event.preventDefault();
        }
        return true;
    }
  };

  return (
    <div className="component-example">
      <TreeMultiSelect
        ref={rtmsRef}
        data={data}
        defaultSelectedIds={selectedIds}
        defaultExpandedIds={expandedIds}
        withSelectAll
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default KeyboardNavigationSimulatorExample;
