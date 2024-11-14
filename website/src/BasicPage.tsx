import React, {FC, memo} from 'react';
import {TreeSelect} from '../../src';
import {optionTreeNodeData} from './utils';

export const BasicPage: FC = memo(() => {

  return (
    <div className="page">
      <h3>Basic tree select</h3>
      <div className="tree-select-wrapper">
        <TreeSelect
          data={optionTreeNodeData}
          id="basic-tree-select"
          className="basic-custom-class"
        />
      </div>
    </div>
  );
});
