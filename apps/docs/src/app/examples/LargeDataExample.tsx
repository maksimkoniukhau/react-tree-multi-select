import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';
import {largeTreeNodeData25, largeTreeNodeData50, RandomTreeNode} from '@/utils/utils';
import {Select} from '@/shared-components/Select';

export const LargeDataExample: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(largeTreeNodeData25.data);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? largeTreeNodeData50.data : largeTreeNodeData25.data);
  };

  return (
    <div className="large-data-example">
      <Select
        label="Choose amount of nodes:"
        options={[
          {name: `${largeTreeNodeData25.amount}`, value: '25'},
          {name: `${largeTreeNodeData50.amount}`, value: '50'}
        ]}
        onChange={handleOptionChange}
      />
      <TreeMultiSelect data={data}/>
    </div>
  );
});
