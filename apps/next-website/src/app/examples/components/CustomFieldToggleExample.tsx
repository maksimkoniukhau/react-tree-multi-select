import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldToggleProps, FieldToggleType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomFieldToggle: FC<FieldToggleProps> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.expanded ? <FontAwesomeIcon icon={faCaretUp}/> : <FontAwesomeIcon icon={faCaretDown}/>}
  </div>
);

const FieldToggle: FieldToggleType = {component: CustomFieldToggle};
const components: Components = {FieldToggle};

export const CustomFieldToggleExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
