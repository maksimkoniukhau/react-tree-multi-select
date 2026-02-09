'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

export const ControlledIsDropdownOpenExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [open, setOpen] = useState<boolean>(false);

  const handleDropdownToggle = (isOpen: boolean): void => {
    setOpen(isOpen);
  };

  return (
    <div className="controlled-example">
      <div className="example-top-content">
        <button className="btn" onClick={() => handleDropdownToggle(!open)}>Toggle dropdown visibility</button>
      </div>
      <TreeMultiSelect
        data={data}
        isDropdownOpen={open}
        onDropdownToggle={handleDropdownToggle}
      />
    </div>
  );
});
