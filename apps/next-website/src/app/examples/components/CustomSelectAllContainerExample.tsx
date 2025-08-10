import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {
  Components,
  SelectAllContainerProps,
  SelectAllContainerType,
  TreeMultiSelect
} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomSelectAllContainer: FC<SelectAllContainerProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.ownProps.label}`}>
    <div {...props.attributes}>
      {props.children}
    </div>
  </Tooltip>
);

const SelectAllContainer: SelectAllContainerType = {component: CustomSelectAllContainer};
const components: Components = {SelectAllContainer};

export const CustomSelectAllContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        withSelectAll
        components={components}
      />
    </div>
  );
};
