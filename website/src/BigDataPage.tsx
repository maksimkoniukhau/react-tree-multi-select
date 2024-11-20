import React, {FC, memo, useState} from 'react';
import {TreeSelect} from '../../src';
import {bigTreeNodeData30, bigTreeNodeData50, RandomTreeNode} from './utils';

export const BigDataPage: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(bigTreeNodeData30.data);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setData(value === '50' ? bigTreeNodeData50.data : bigTreeNodeData30.data);
  };

  return (
    <div className="page">
      <h3>{'Tree select big data'}</h3>
      <select className="bd-select" onChange={handleOptionChange}>
        <option value="30">{`Nodes amount: ${bigTreeNodeData30.amount}`}</option>
        <option value="50">{`Nodes amount: ${bigTreeNodeData50.amount}`}</option>
      </select>
      <div className="tree-select-wrapper">
        <TreeSelect
          data={data}
          id="rts-big-data"
          className="bd-custom-class"
          withSelectAll
        />
      </div>
    </div>
  );
});
