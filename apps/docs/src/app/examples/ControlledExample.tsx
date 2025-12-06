import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseExpandedIds, getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const ControlledExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData(true));
  const [selectedIds, setSelectedIds] = useState<string[]>(getBaseSelectedIds());
  const [expandedIds, setExpandedIds] = useState<string[]>(getBaseExpandedIds());
  const [open, setOpen] = useState<boolean>(true);

  const handleDropdownToggle = (open: boolean): void => {
    setOpen(open);
  };

  const handleNodeChange = (_node: TreeNode, selectedIds: string[]): void => {
    setSelectedIds(selectedIds);
  };

  const handleNodeToggle = (_node: TreeNode, expandedIds: string[]): void => {
    setExpandedIds(expandedIds);
  };

  return (
    <div className="controlled-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        withClearAll={false}
        openDropdown={open}
        onDropdownToggle={handleDropdownToggle}
        onNodeChange={handleNodeChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  );
});
