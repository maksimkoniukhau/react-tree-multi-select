'use client'

import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import {Components, SelectAllLabelProps, SelectAllLabelType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomSelectAllLabel: FC<SelectAllLabelProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.label}{' '}<FontAwesomeIcon icon={faCheckDouble}/>
  </div>
);

const SelectAllLabel: SelectAllLabelType = {component: CustomSelectAllLabel};
const components: Components = {SelectAllLabel};

export const CustomSelectAllLabelExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        defaultSelectedIds={selectedIds}
        withSelectAll
        components={components}
      />
    </div>
  );
};
