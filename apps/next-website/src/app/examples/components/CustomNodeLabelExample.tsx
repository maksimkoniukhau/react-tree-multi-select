import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHandSpock} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeLabelProps, NodeLabelType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils';

const CustomNodeLabel: FC<NodeLabelProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faHandSpock}/>{' '}{props.ownProps.label}
  </div>
);

const NodeLabel: NodeLabelType = {component: CustomNodeLabel};
const components: Components = {NodeLabel};

export const CustomNodeLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
