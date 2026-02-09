'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';
import {Checkbox} from '@/shared-components/Checkbox';

export const ControlledSelectionExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds, setSelectedIds] = useState<string[]>(getBaseSelectedIds());
  const [open, setOpen] = useState<boolean>(false);
  const [keepOpen, setKeepOpen] = useState<boolean>(false);

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleClearAll = (selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleDropdownToggle = (isOpen: boolean): void => {
    setOpen(isOpen || keepOpen);
  };

  const handleSelectAllChange = (selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleButtonClick = (): void => {
    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.includes('1')
        ? prevSelectedIds.filter(id => id !== '1')
        : [...prevSelectedIds, '1']
    );
  };

  return (
    <div className="controlled-example">
      <div className="example-top-content">
        <button className="btn" onClick={handleButtonClick}>Toggle first node expansion</button>
        <Checkbox label="Keep dropdown open" checked={keepOpen} onChange={(v) => setKeepOpen(v)}/>
      </div>
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withSelectAll
        isDropdownOpen={open}
        onNodeChange={handleNodeChange}
        onClearAll={handleClearAll}
        onSelectAllChange={handleSelectAllChange}
        onDropdownToggle={handleDropdownToggle}
      />
    </div>
  );
});
