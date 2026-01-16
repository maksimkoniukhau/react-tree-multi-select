'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseExpandedIds, getTreeNodeData} from '@/utils/utils';

export const UncontrolledExpansionExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());

  return (
    <TreeMultiSelect
      data={data}
      defaultExpandedIds={getBaseExpandedIds()}
    />
  );
});
