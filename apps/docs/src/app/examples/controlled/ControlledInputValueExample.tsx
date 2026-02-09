'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';
import {Checkbox} from '@/shared-components/Checkbox';

export const ControlledInputValueExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [value, setValue] = useState<string>('spring');
  const [open, setOpen] = useState<boolean>(false);
  const [keepOpen, setKeepOpen] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.currentTarget.value);
  };

  const handleDropdownToggle = (isOpen: boolean): void => {
    setOpen(isOpen || keepOpen);
  };

  return (
    <div className="controlled-example">
      <div className="example-top-content">
        <input value={value} onChange={handleInputChange}/>
        <Checkbox label="Keep dropdown open" checked={keepOpen} onChange={(v) => setKeepOpen(v)}/>
      </div>
      <TreeMultiSelect
        data={data}
        inputValue={value}
        isDropdownOpen={open}
        onInputChange={handleInputChange}
        onDropdownToggle={handleDropdownToggle}
      />
    </div>
  );
});
