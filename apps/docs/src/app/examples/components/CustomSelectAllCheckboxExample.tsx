'use client'

import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {
  Components,
  SelectAllCheckboxProps,
  SelectAllCheckboxType,
  SelectionAggregateState,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomSelectAllCheckbox: FC<SelectAllCheckboxProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.selectionAggregateState === SelectionAggregateState.ALL
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.ownProps.selectionAggregateState === SelectionAggregateState.NONE
        ? <FontAwesomeIcon icon={faSquare}/>
        : <FontAwesomeIcon icon={faSquareMinus}/>
    }
  </div>
);

const SelectAllCheckbox: SelectAllCheckboxType = {component: CustomSelectAllCheckbox};
const components: Components = {SelectAllCheckbox};

export const CustomSelectAllCheckboxExample: FC = () => {

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
