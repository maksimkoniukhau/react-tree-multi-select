import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';
import {generateRandomTreeNodeData, RandomTreeNode} from '@/utils/utils';

/*Add to styles:
.non-virtualized-example .rtms-dropdown {
  width: auto;
}*/
export const NonVirtualizedExample: FC = memo(() => {

  const [data] = useState<RandomTreeNode[]>(generateRandomTreeNodeData(3, 3));

  return (
    <div className="non-virtualized-example">
      <TreeMultiSelect
        data={data}
        isVirtualized={false}
      />
    </div>
  );
});
