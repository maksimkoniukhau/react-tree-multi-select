import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {
  Components,
  SelectAllContainerProps,
  SelectAllContainerType,
  TreeMultiSelect
} from '../../treeMultiSelectImport';
import {getTreeNodeData} from '../../utils';

const CustomSelectAllContainer: FC<SelectAllContainerProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.componentProps.label}`}>
    <div {...props.componentAttributes}>
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
