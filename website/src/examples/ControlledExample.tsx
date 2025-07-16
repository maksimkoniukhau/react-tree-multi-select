import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from '../treeMultiSelectImport';
import {getTreeNodeData} from '../utils';
import {OptionTreeNode} from '../data';

export const ControlledExample: FC = memo(() => {

  const [data, setData] = useState<OptionTreeNode[]>(getTreeNodeData(true, true, true));
  const [open, setOpen] = useState<boolean>(true);

  const handleDropdownToggle = (open: boolean): void => {
    setOpen(open);
  };

  const selectNode = (node: TreeNode, selectedNodes: TreeNode[]): void => {
    node.selected = selectedNodes.some(selectedNode => (selectedNode as OptionTreeNode).option.id === (node as OptionTreeNode).option.id);
    node.children?.forEach(child => selectNode(child, selectedNodes));
  };

  const toggleNode = (node: TreeNode, expandedNodes: TreeNode[]): void => {
    node.expanded = expandedNodes.some(expandedNode => (expandedNode as OptionTreeNode).option.id === (node as OptionTreeNode).option.id);
    node.children?.forEach(child => toggleNode(child, expandedNodes));
  };

  const handleNodeChange = (_: TreeNode, selectedNodes: TreeNode[]): void => {
    data.forEach(optionTreeNode => selectNode(optionTreeNode, selectedNodes));
    setData([...data]);
  };

  const handleNodeToggle = (_: TreeNode, expandedNodes: TreeNode[]): void => {
    data.forEach(optionTreeNode => toggleNode(optionTreeNode, expandedNodes));
    setData([...data]);
  };

  return (
    <div className="controlled-example">
      <TreeMultiSelect
        data={data}
        withClearAll={false}
        openDropdown={open}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});
