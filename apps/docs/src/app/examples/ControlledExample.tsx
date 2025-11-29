import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const ControlledExample: FC = memo(() => {

  const [data, setData] = useState<TreeNode[]>(getTreeNodeData(true, true));
  const [selectedIds, setSelectedIds] = useState<string[]>(getBaseSelectedIds());
  const [open, setOpen] = useState<boolean>(true);

  const handleDropdownToggle = (open: boolean): void => {
    setOpen(open);
  };

  const handleNodeChange = (_node: TreeNode, selectedNodes: TreeNode[]): void => {
    setSelectedIds(selectedNodes.map(node => node.id));
  };

  const handleNodeToggle = (_node: TreeNode, _expandedNodes: TreeNode[], data: TreeNode[]): void => {
    setData(data);
  };

  return (
    <div className="controlled-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withClearAll={false}
        openDropdown={open}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});
