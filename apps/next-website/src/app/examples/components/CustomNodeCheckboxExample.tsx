import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeCheckboxProps, NodeCheckboxType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomNodeCheckbox: FC<NodeCheckboxProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.checked
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.ownProps.partial
        ? <FontAwesomeIcon icon={faSquareMinus}/>
        : <FontAwesomeIcon icon={faSquare}/>
    }
  </div>
);

const NodeCheckbox: NodeCheckboxType = {component: CustomNodeCheckbox};
const components: Components = {NodeCheckbox};

export const CustomNodeCheckboxExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
