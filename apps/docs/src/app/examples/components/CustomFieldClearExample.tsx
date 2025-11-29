import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDeleteLeft} from '@fortawesome/free-solid-svg-icons';
import {Components, FieldClearProps, FieldClearType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomFieldClear: FC<FieldClearProps> = (props) => (
  <div {...props.attributes}>
    <FontAwesomeIcon icon={faDeleteLeft}/>
  </div>
);

const FieldClear: FieldClearType = {component: CustomFieldClear};
const components: Components = {FieldClear};

export const CustomFieldClearExample: FC = () => {

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
