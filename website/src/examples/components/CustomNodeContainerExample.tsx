import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {Components, NodeContainerProps, NodeContainerType, TreeMultiSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomNodeContainer: FC<NodeContainerProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.componentProps.label}`}>
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  </Tooltip>
);

const NodeContainer: NodeContainerType = {component: CustomNodeContainer};
const components: Components = {NodeContainer};

export const CustomNodeContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
