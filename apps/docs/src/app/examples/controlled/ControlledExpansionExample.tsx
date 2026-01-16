'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseExpandedIds, getTreeNodeData} from '@/utils/utils';

export const ControlledExpansionExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [expandedIds, setExpandedIds] = useState<string[]>(getBaseExpandedIds());

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[]): void => {
    setExpandedIds(expandedIds);
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
      <button className="btn" onClick={handleButtonClick}>
        Toggle first node expansion
      </button>
      <TreeMultiSelect
        data={data}
        expandedIds={expandedIds}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});
