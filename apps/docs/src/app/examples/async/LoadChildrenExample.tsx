'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {fetchFakeChildren, getTreeNodesWithHasChildren} from '@/utils/utils';

export const LoadChildrenExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(getTreeNodesWithHasChildren(10));

  const handleLoadChildren = (id: string): Promise<TreeNode[]> => {
    return fetchFakeChildren(id, 3, true, 1000);
  };

  return (
    <TreeMultiSelect
      data={data}
      onLoadChildren={handleLoadChildren}
    />
  );
});
