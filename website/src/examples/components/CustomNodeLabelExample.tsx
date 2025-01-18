import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandSpock} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeLabelProps, NodeLabelType, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomNodeLabel: FC<NodeLabelProps> = (props) => (
  <div {...props.componentAttributes}>
    <FontAwesomeIcon icon={faHandSpock}/>
    {props.componentProps.label}
  </div>
);

const NodeLabel: NodeLabelType = {component: CustomNodeLabel};
const components: Components = {NodeLabel};

export const CustomNodeLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
