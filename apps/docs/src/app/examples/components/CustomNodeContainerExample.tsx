import React, {FC} from 'react';
import {Tooltip} from 'react-tooltip';
import {Components, components, NodeContainerProps, NodeContainerType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

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

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={customComponents}
      />
    </div>
  );
};
