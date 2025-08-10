import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';
import {OptionTreeNode} from '@/utils/data';

export const ControlledExample: FC = memo(() => {

  const [data, setData] = useState<OptionTreeNode[]>(getTreeNodeData(true, true, true));
  const [open, setOpen] = useState<boolean>(true);

  const handleDropdownToggle = (open: boolean): void => {
    setOpen(open);
  };

  const handleNodeChange = (_node: TreeNode, _selectedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data as OptionTreeNode[]);
  };

  const handleNodeToggle = (_node: TreeNode, _expandedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data as OptionTreeNode[]);
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
