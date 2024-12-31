import React, {FC, memo, useState} from 'react';
import {TreeSelect} from '../../src';
import {bigTreeNodeData30, bigTreeNodeData50, RandomTreeNode} from './utils';
import {Select} from './Select';

export const BigDataPage: FC = memo(() => {

  const [data, setData] = useState<RandomTreeNode[]>(bigTreeNodeData30.data);

  const handleOptionChange = (value: string): void => {
    setData(value === '50' ? bigTreeNodeData50.data : bigTreeNodeData30.data);
  };

  return (
    <div className="page big-data-page">
      <h3>{'RTS tree select big data'}</h3>
      <div className="paragraph">
        {'RTS uses '}
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
