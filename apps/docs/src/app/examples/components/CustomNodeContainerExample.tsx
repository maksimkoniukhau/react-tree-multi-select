import React, {FC, useState} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  Components,
  components,
  NodeContainerProps,
  NodeContainerType,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNodeContainer: FC<NodeContainerProps> = (props) => (
  <>
    <Tooltip id="node-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <components.NodeContainer
      {...props}
      attributes={{
        ...props.attributes,
        "data-tooltip-id": "node-tooltip",
        "data-tooltip-content": `Tooltip for the ${props.ownProps.label}`,
        "data-tooltip-place": "top"
      }}/>
  </>
);

const NodeContainer: NodeContainerType = {component: CustomNodeContainer};
const customComponents: Components = {NodeContainer};

export const CustomNodeContainerExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={customComponents}
      />
    </div>
  );
};
