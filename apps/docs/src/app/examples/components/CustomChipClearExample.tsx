import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ChipClearType, Components, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomChipClear: FC<ChipClearProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faTrash}/>
  </div>
);

const ChipClear: ChipClearType = {component: CustomChipClear};
const components: Components = {ChipClear};

export const CustomChipClearExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};
