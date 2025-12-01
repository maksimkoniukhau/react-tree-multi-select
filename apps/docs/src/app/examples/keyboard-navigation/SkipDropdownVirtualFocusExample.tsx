import React, {FC} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';

export const SkipDropdownVirtualFocusExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={[
          {
            id: '1',
            label: 'node-1',
            children: [
              {id: '1.1', label: 'node-1-child-1', disabled: true, skipDropdownVirtualFocus: true},
              {id: '1.2', label: 'node-1-child-2'}
            ]
          },
          {
            id: '2',
            label: 'node-2',
            children: [
              {id: '2.1', label: 'node-2-child-1'},
              {id: '2.2', label: 'node-2-child-2', disabled: true, skipDropdownVirtualFocus: true}
            ]
          },
          {
            id: '3',
            label: 'node-3',
            children: [
              {id: '3.1', label: 'node-3-child-1', disabled: true, skipDropdownVirtualFocus: true},
              {id: '3.2', label: 'node-3-child-2'}
            ]
          }
        ]}
        selectedIds={['3']}
        expandedIds={['1', '2', '3']}
      />
    </div>
  );
};
