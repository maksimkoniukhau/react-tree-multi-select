'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {largeTreeNodeData25, largeTreeNodeData50} from '@/utils/utils';
import {Select} from '@/shared-components/Select';

export const LargeDataExample: FC = memo(() => {

  const [data, setData] = useState<TreeNode[]>(largeTreeNodeData25.data);
  const [selectedIds, setSelectedIds] = useState<string[]>(['1.0.0.0.1.1', '5.5.3.0.0.0', '10.3.0.0.0.0']);
  const [expandedIds, setExpandedIds] = useState<string[]>(largeTreeNodeData25.expandedIds);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? largeTreeNodeData50.data : largeTreeNodeData25.data);
    setExpandedIds(value === '50' ? largeTreeNodeData50.expandedIds : largeTreeNodeData25.expandedIds);
  };

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[]): void => {
    setExpandedIds(expandedIds);
  };

  return (
    <div className="large-data-example">
      <Select
        label="Choose number of nodes:"
        options={[
          {name: `${largeTreeNodeData25.count}`, value: '25'},
          {name: `${largeTreeNodeData50.count}`, value: '50'}
        ]}
        onChange={handleOptionChange}
      />
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});
