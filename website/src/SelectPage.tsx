import React, {FC, memo} from 'react';
import {TreeSelect} from '../../src';

export const SelectPage: FC = memo(() => {

  return (
    <div className="page">
      <h3>{'Multi-select'}</h3>
      <div className="tree-select-wrapper">
        <TreeSelect
          data={[
            {
              label: 'label1',
              name: 'name1'
            },
            {
              label: 'label2',
              name: 'name2'
            },
            {
              label: 'label3',
              name: 'name3'
            }
          ]}
          id="rts-multi-select"
          withSelectAll
          withClearAll
        />
      </div>
    </div>
  );
});
