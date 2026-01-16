'use client'

import React, {FC} from 'react';
import {SelectionAggregateState, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';

export const SimpleUsageExample: FC = () => {

  const data: TreeNode[] = [
    {
      id: '1',
      label: 'label1',
      children: [
        {
          id: '1.1',
          label: 'child11-label'
        },
        {
          id: '1.2',
          label: 'child12-label'
        }
      ]
    },
    {
      id: '2',
      label: 'label2',
      children: [
        {
          id: '2.1',
          label: 'child21-label'
        },
        {
          id: '2.2',
          label: 'child22-label'
        }
      ]
    },
    {
      id: '3',
      label: 'label3'
    }
  ];

  const handleNodeChange = (node: TreeNode, selectedIds: string[]): void => {
    console.log('handleNodeChange node:', node);
    console.log('handleNodeChange selectedIds:', selectedIds);
  };

  const handleNodeToggle = (node: TreeNode, expandedIds: string[]): void => {
    console.log('handleNodeToggle node:', node);
    console.log('handleNodeToggle expandedIds:', expandedIds);
  };

  const handleClearAll = (selectedIds: string[], selectionAggregateState: SelectionAggregateState): void => {
    console.log('handleClearAll selectedIds:', selectedIds);
    console.log('handleClearAll selectionAggregateState:', selectionAggregateState);
  };

  const handleSelectAllChange = (selectedIds: string[], selectionAggregateState: SelectionAggregateState): void => {
    console.log('handleSelectAllChange selectedIds:', selectedIds);
    console.log('handleSelectAllChange selectionAggregateState:', selectionAggregateState);
  };

  return (
    <TreeMultiSelect
      data={data}
      withSelectAll
      onNodeChange={handleNodeChange}
      onNodeToggle={handleNodeToggle}
      onClearAll={handleClearAll}
      onSelectAllChange={handleSelectAllChange}
    />
  );
};