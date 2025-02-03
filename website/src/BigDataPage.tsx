import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from './treeMultiSelectImport';
import {bigTreeNodeData30, bigTreeNodeData50, RandomTreeNode} from './utils';
import {Select} from './Select';

export const BigDataPage: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(bigTreeNodeData30.data);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? bigTreeNodeData50.data : bigTreeNodeData30.data);
  };

  return (
    <div className="page">
      <div className="page-content big-data-page">
        <h2>{'React Tree Multi Select big data'}</h2>
        <div className="paragraph">
          <b>{'react-tree-multi-select'}</b>{' uses '}
          <a href="https://github.com/petyosi/react-virtuoso" target="_blank">Virtuoso</a>
          {' library to render big amount of nodes.'}
        </div>
        <Select
          label="Choose amount of nodes:"
          options={[
            {name: `${bigTreeNodeData30.amount}`, value: '30'},
            {name: `${bigTreeNodeData50.amount}`, value: '50'}
          ]}
          onChange={handleOptionChange}/>
        <div className="tree-multi-select-wrapper">
          <TreeMultiSelect
            data={data}
            id="rtms-big-data"
            className="bd-custom-class"
            withSelectAll
          />
        </div>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
});
