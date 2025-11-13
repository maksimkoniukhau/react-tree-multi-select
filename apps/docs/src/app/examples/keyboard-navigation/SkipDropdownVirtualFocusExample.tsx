import React, {FC} from 'react';
import {TreeMultiSelect} from 'react-tree-multi-select';

export const SkipDropdownVirtualFocusExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={[
          {
            label: 'node-1',
            expanded: true,
            children: [
              {label: 'node-1-child-1', disabled: true, skipDropdownVirtualFocus: true},
              {label: 'node-1-child-2'}
            ]
          },
          {
            label: 'node-2',
            expanded: true,
            children: [
              {label: 'node-2-child-1'},
              {label: 'node-2-child-2', disabled: true, skipDropdownVirtualFocus: true}
            ]
          },
          {
            label: 'node-3',
            expanded: true,
            selected: true,
            children: [
              {label: 'node-3-child-1', disabled: true, skipDropdownVirtualFocus: true},
              {label: 'node-3-child-2'}
            ]
          }
        ]}
      />
    </div>
  );
};
