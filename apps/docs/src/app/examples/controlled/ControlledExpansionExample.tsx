'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseExpandedIds, getTreeNodeData} from '@/utils/utils';
import {Checkbox} from '@/shared-components/Checkbox';

export const ControlledExpansionExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [expandedIds, setExpandedIds] = useState<string[]>(getBaseExpandedIds());
  const [open, setOpen] = useState<boolean>(false);
  const [keepOpen, setKeepOpen] = useState<boolean>(false);

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[]): void => {
    setExpandedIds(expandedIds);
  };

  const handleDropdownToggle = (isOpen: boolean): void => {
    setOpen(isOpen || keepOpen);
  };

  const handleButtonClick = (): void => {
    setExpandedIds(prevExpandedIds =>
      prevExpandedIds.includes('1')
        ? prevExpandedIds.filter(id => id !== '1')
        : [...prevExpandedIds, '1']
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
        expandedIds={expandedIds}
        isDropdownOpen={open}
        onNodeToggle={handleNodeToggle}
        onDropdownToggle={handleDropdownToggle}
      />
    </div>
  );
});
