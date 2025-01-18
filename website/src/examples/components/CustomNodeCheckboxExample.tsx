import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare, faSquareCheck, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {Components, NodeCheckboxProps, NodeCheckboxType, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomNodeCheckbox: FC<NodeCheckboxProps> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.checked
      ? <FontAwesomeIcon icon={faSquareCheck}/>
      : props.componentProps.partial
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
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
