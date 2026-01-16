'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const ControlledSelectionExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds, setSelectedIds] = useState<string[]>(getBaseSelectedIds());

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleClearAll = (selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
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
      <button className="btn" onClick={handleButtonClick}>
        Toggle first node selection
      </button>
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withSelectAll
        onNodeChange={handleNodeChange}
        onClearAll={handleClearAll}
        onSelectAllChange={handleSelectAllChange}
      />
    </div>
  );
});
