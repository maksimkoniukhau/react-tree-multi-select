'use client'

import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {generateRandomTreeNodeData, getAllExpandedIds} from '@/utils/utils';

/*Add to styles:
.non-virtualized-example .rtms-dropdown {
  width: auto;
}*/
export const NonVirtualizedExample: FC = memo(() => {

  const [data] = useState<TreeNode[]>(generateRandomTreeNodeData(3, 5));

  return (
    <div className="non-virtualized-example">
      <TreeMultiSelect
        data={data}
        isVirtualized={false}
      />
    </div>
  );
});
