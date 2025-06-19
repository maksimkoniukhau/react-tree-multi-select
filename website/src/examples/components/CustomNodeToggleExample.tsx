import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Components, NodeToggleProps, NodeToggleType, TreeMultiSelect} from '../../treeMultiSelectImport';
import {getTreeNodeData} from '../../utils';

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

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
