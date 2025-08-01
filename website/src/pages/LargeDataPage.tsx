import React, {FC, memo, useState} from 'react';
import {TreeMultiSelect} from '../treeMultiSelectImport';
import {largeTreeNodeData30, largeTreeNodeData50, RandomTreeNode} from '../utils';
import {Select} from '../components/Select';
import {PageNavigation} from '../components/PageNavigation';

export const LargeDataPage: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(largeTreeNodeData30.data);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? largeTreeNodeData50.data : largeTreeNodeData30.data);
  };

  return (
    <div className="page">
      <div className="page-content large-data-page">
        <h2>{'Large Data'}</h2>
        <div className="paragraph">
          <b>{'react-tree-multi-select'}</b>{' uses virtualization to efficiently render large numbers of nodes.'}
        </div>
        <Select
          label="Choose amount of nodes:"
          options={[
            {name: `${largeTreeNodeData30.amount}`, value: '30'},
            {name: `${largeTreeNodeData50.amount}`, value: '50'}
          ]}
          onChange={handleOptionChange}/>
        <div className="tree-multi-select-wrapper">
          <TreeMultiSelect
            data={data}
            id="rtms-large-data"
            className="bd-custom-class"
            withSelectAll
          />
        </div>
      </div>
      <PageNavigation items={[]}/>
    </div>
  );
});
