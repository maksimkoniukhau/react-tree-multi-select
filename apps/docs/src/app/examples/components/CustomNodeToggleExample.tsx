'use client'

import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Components, NodeToggleProps, NodeToggleType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeToggle: FC<NodeToggleProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.expanded
      ? <FontAwesomeIcon icon={faMinus}/>
      : <FontAwesomeIcon icon={faPlus}/>
    }
  </div>
);

const NodeToggle: NodeToggleType = {component: CustomNodeToggle};
const components: Components = {NodeToggle};

export const CustomNodeToggleExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        defaultSelectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};
