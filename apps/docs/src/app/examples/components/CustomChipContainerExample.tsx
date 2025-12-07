'use client'

import React, {FC, useState} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  ChipContainerProps,
  ChipContainerType,
  Components,
  components,
  TreeMultiSelect,
  TreeNode
} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <>
    <Tooltip id="chip-tooltip" render={({content}) => (<span>{content}</span>)}/>
    <components.ChipContainer
      {...props}
      attributes={{
        ...props.attributes,
        "data-tooltip-id": "chip-tooltip",
        "data-tooltip-content": `Tooltip for the ${props.ownProps.label}`,
        "data-tooltip-place": "top"
      }}/>
  </>
);

const ChipContainer: ChipContainerType = {component: CustomChipContainer};
const customComponents: Components = {ChipContainer};

export const CustomChipContainerExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        defaultSelectedIds={selectedIds}
        components={customComponents}
      />
    </div>
  );
};
