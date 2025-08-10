import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {
  Components,
  components,
  NodeContainerProps,
  NodeContainerType,
  TreeMultiSelect
} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomNodeContainer: FC<NodeContainerProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.ownProps.label}`}>
    <components.NodeContainer {...props}/>
  </Tooltip>
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
