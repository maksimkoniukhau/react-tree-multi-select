import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandSpock} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeLabelProps, NodeLabelType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeLabel: FC<NodeLabelProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faHandSpock}/>{' '}{props.ownProps.label}
  </div>
);

const NodeLabel: NodeLabelType = {component: CustomNodeLabel};
const components: Components = {NodeLabel};

export const CustomNodeLabelExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
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
