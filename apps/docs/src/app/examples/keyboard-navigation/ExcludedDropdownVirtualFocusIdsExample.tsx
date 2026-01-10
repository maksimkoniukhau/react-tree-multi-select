'use client'

import React, {FC, useMemo} from 'react';
import {buildVirtualFocusId, DROPDOWN_PREFIX, TreeMultiSelect, VirtualFocusConfig} from 'react-tree-multi-select';

export const ExcludedDropdownVirtualFocusIdsExample: FC = () => {

  const virtualFocusConfig: VirtualFocusConfig = useMemo(() => {
    const disabledIds = ['1.1', '2.2', '3.1'];
    return {
      excludedVirtualFocusIds: disabledIds.map(id => buildVirtualFocusId(DROPDOWN_PREFIX, id))
    };
  }, []);

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={[
          {
            id: '1',
            label: 'node-1',
            children: [
              {id: '1.1', label: 'node-1-child-1', disabled: true},
              {id: '1.2', label: 'node-1-child-2'}
            ]
          },
          {
            id: '2',
            label: 'node-2',
            children: [
              {id: '2.1', label: 'node-2-child-1'},
              {id: '2.2', label: 'node-2-child-2', disabled: true}
            ]
          },
          {
            id: '3',
            label: 'node-3',
            children: [
              {id: '3.1', label: 'node-3-child-1', disabled: true},
              {id: '3.2', label: 'node-3-child-2'}
            ]
          }
        ]}
        defaultSelectedIds={['3']}
        defaultExpandedIds={['1', '2', '3']}
        virtualFocusConfig={virtualFocusConfig}
      />
    </div>
  );
};
