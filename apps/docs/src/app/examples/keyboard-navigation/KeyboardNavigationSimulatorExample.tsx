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
  TreeNode
} from 'react-tree-multi-select';
import {getBaseExpandedIds, getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const KeyboardNavigationSimulatorExample: FC = () => {

  const rtmsRef = useRef<TreeMultiSelectHandle>(null);

  const [data] = useState<TreeNode[]>(getTreeNodeData(true));
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());
  const [expandedIds] = useState<string[]>(getBaseExpandedIds());

  const withDropdownInput = false;

  const handleKeyDown = (event: React.KeyboardEvent): boolean | undefined => {
    const rtmsAPI = rtmsRef.current;
    if (!rtmsAPI) {
      return;
    }
    const {inputValue, isDropdownOpen, virtualFocusId} = rtmsAPI.getState();
    switch (event.key) {
      case 'ArrowLeft':
        if (rtmsAPI.isVirtualFocusInDropdown(virtualFocusId)) {
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
        if (rtmsAPI.isVirtualFocusInDropdown(virtualFocusId)) {
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
        if (isDropdownOpen && rtmsAPI.isVirtualFocusInDropdown(virtualFocusId)) {
          rtmsAPI.focusPrevItem();
        } else {
          rtmsAPI.toggleDropdown();
        }
        event.preventDefault();
        return true;
      case 'ArrowDown':
        if (isDropdownOpen) {
          if (rtmsAPI.isVirtualFocusInDropdown(virtualFocusId)) {
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
        if (rtmsAPI.isVirtualFocusInDropdown(virtualFocusId)) {
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
        if (rtmsAPI.isVirtualFocusInDropdown(virtualFocusId)) {
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
        if (!virtualFocusId || rtmsAPI.isVirtualFocusInField(virtualFocusId)) {
          rtmsAPI.toggleDropdown();
          if (!(!virtualFocusId
            || rtmsAPI.buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX) === virtualFocusId
            || rtmsAPI.buildVirtualFocusId(FIELD_PREFIX, CLEAR_ALL_SUFFIX) === virtualFocusId)) {
            // chip is focused. any action can be performed
          }
        } else {
          if (rtmsAPI.buildVirtualFocusId(DROPDOWN_PREFIX, SELECT_ALL_SUFFIX) === virtualFocusId) {
            rtmsAPI.toggleAllSelection();
          } else {
            rtmsAPI.toggleNodeSelection();
          }
        }
        event.preventDefault();
        return true;
      case 'Backspace':
        if (!inputValue && rtmsAPI.isVirtualFocusInField(virtualFocusId)
          && rtmsAPI.buildVirtualFocusId(FIELD_PREFIX, INPUT_SUFFIX) !== virtualFocusId) {
          if (rtmsAPI.buildVirtualFocusId(FIELD_PREFIX, CLEAR_ALL_SUFFIX) === virtualFocusId) {
            rtmsAPI.deselectAll();
          } else {
            rtmsAPI.deselectNode();
            if (!rtmsAPI.getById(rtmsAPI.extractElementId(virtualFocusId))?.disabled) {
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
