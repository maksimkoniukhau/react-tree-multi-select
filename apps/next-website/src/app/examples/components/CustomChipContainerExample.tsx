import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {ChipContainerProps, ChipContainerType, Components, components, TreeMultiSelect} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.ownProps.label}`}>
    <components.ChipContainer {...props}/>
  </Tooltip>
);

const ChipContainer: ChipContainerType = {component: CustomChipContainer};
const customComponents: Components = {ChipContainer};

export const CustomChipContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={customComponents}
      />
    </div>
  );
};
