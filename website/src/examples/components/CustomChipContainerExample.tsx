import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {ChipContainerProps, ChipContainerType, Components, TreeMultiSelect} from '../../treeMultiSelectImport';
import {getTreeNodeData} from '../../utils';

const CustomChipContainer: FC<ChipContainerProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.componentProps.label}`}>
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  </Tooltip>
);

const ChipContainer: ChipContainerType = {component: CustomChipContainer};
const components: Components = {ChipContainer};

export const CustomChipContainerExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
