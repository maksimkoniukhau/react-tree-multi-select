import React, {FC, memo} from 'react';
import {CheckedState, TreeNode, TreeSelect, Type} from '../../src';
import {optionTreeNodeData} from './utils';

export const BasicPage: FC = memo(() => {

  const handleNodeChange = (node: TreeNode, selectedNodes: TreeNode[]) => {
    console.log('node', node);
    console.log('selectedNodes', selectedNodes);
  };

  const handleNodeToggle = (node: TreeNode, expandedNodes: TreeNode[]) => {
    console.log('node', node);
    console.log('expandedNodes', expandedNodes);
  };

  const handleClearAll = (selectAllCheckedState: CheckedState, selectedNodes: TreeNode[]) => {
    console.log('handleClearAll selectAllCheckedState', selectAllCheckedState);
    console.log('handleClearAll selectedNodes', selectedNodes);
  };

  const handleSelectAllChange = (selectAllCheckedState: CheckedState, selectedNodes: TreeNode[]) => {
    console.log('handleSelectAllChange selectAllCheckedState', selectAllCheckedState);
    console.log('handleSelectAllChange selectedNodes', selectedNodes);
  };

  return (
    <div className="page">
      <h3>{'Basic tree select'}</h3>
      <div className="tree-select-wrapper">
        <TreeSelect
          data={optionTreeNodeData}
          type={Type.MULTI_SELECT_TREE}
          id="basic-tree-select"
          className="basic-custom-class"
          withSelectAll
          withClearAll
          onNodeChange={handleNodeChange}
          onNodeToggle={handleNodeToggle}
          onClearAll={handleClearAll}
          onSelectAllChange={handleSelectAllChange}
        />
      </div>
    </div>
  );
});
