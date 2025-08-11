import React, {FC} from 'react';
import {Tooltip} from 'react-tooltip';
import {Components, SelectAllContainerProps, SelectAllContainerType, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

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
