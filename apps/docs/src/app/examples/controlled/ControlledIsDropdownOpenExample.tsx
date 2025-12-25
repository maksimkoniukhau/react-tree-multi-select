'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseExpandedIds, getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const ControlledIsDropdownOpenExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData(true));
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());
  const [expandedIds] = useState<string[]>(getBaseExpandedIds());
  const [open, setOpen] = useState<boolean>(true);

  const handleDropdownToggle = (open: boolean): void => {
    setOpen(open);
  };

  return (
    <div className="controlled-example">
      <button className="btn" onClick={() => handleDropdownToggle(!open)}>
        Toggle dropdown
      </button>
      <TreeMultiSelect
        data={data}
        defaultSelectedIds={selectedIds}
        defaultExpandedIds={expandedIds}
        isDropdownOpen={open}
        onDropdownToggle={handleDropdownToggle}
      />
    </div>
  );
});
