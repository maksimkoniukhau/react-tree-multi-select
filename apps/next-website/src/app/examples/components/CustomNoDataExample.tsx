import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaceSadTear} from '@fortawesome/free-regular-svg-icons';
import {Components, NoDataProps, NoDataType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomNoData: FC<NoDataProps> = (props) => (
  <div {...props.attributes}>
    <div><FontAwesomeIcon icon={faFaceSadTear}/>{' '}{props.ownProps.label}</div>
  </div>
);

const NoData: NoDataType = {component: CustomNoData};
const components: Components = {NoData};

export const CustomNoDataExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
