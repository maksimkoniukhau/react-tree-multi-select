import React, {FC, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaceSadTear} from '@fortawesome/free-regular-svg-icons';
import {Components, NoDataProps, NoDataType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

const CustomNoData: FC<NoDataProps> = (props) => (
  <div {...props.attributes}>
    <div><FontAwesomeIcon icon={faFaceSadTear}/>{' '}{props.ownProps.label}</div>
  </div>
);

const NoData: NoDataType = {component: CustomNoData};
const components: Components = {NoData};

export const CustomNoDataExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        defaultSelectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};
