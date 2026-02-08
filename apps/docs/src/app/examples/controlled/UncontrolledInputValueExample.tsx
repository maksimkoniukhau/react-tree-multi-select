'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

export const UncontrolledInputValueExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());

  return (
    <TreeMultiSelect
      data={data}
      defaultInputValue="html"
    />
  );
});
