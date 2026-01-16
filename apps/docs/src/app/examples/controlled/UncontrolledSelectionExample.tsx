'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

export const UncontrolledSelectionExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());

  return (
    <TreeMultiSelect
      data={data}
      defaultSelectedIds={getBaseSelectedIds()}
      withSelectAll
    />
  );
});
