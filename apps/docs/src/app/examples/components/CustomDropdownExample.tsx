import React, {FC, useState} from 'react';
import {Components, DropdownProps, DropdownType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomDropdown: FC<DropdownProps> = (props) => {
  return (
    <div {...props.attributes}>
      <div style={{padding: '10px', display: 'flex', justifyContent: 'center', borderBottom: '2px solid #ebebeb'}}>
        <label>{'Custom Dropdown top content'}</label>
      </div>
      {props.children}
      <div style={{padding: '10px', display: 'flex', justifyContent: 'center', borderTop: '2px solid #ebebeb'}}>
        <label>{'Custom Dropdown bottom content'}</label>
      </div>
    </div>
  );
};

const Dropdown: DropdownType = {component: CustomDropdown};
const components: Components = {Dropdown};

export const CustomDropdownExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData(true));
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};
