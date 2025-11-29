import React, {FC, useState} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  Components,
  SelectAllContainerProps,
  SelectAllContainerType,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomSelectAllContainer: FC<SelectAllContainerProps> = (props) => (
  <>
    <Tooltip id="select-all-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <div
      {...props.attributes}
      data-tooltip-id="select-all-tooltip"
      data-tooltip-content={`Tooltip for the ${props.ownProps.label}`}
      data-tooltip-place="top"
    >
      {props.children}
    </div>
  </>
);

const SelectAllContainer: SelectAllContainerType = {component: CustomSelectAllContainer};
const components: Components = {SelectAllContainer};

export const CustomSelectAllContainerExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        withSelectAll
        components={components}
      />
    </div>
  );
};
