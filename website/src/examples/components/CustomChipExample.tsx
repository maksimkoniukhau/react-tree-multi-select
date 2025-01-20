import React, {FC} from 'react';
import Tooltip from '@atlaskit/tooltip';
import {ChipProps, ChipType, Components, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomChip: FC<ChipProps> = (props) => (
  <Tooltip content={`Tooltip for the ${props.componentProps.label}`}>
    <div {...props.componentAttributes}>
      {props.children}
    </div>
  </Tooltip>
);

const Chip: ChipType = {component: CustomChip};
const components: Components = {Chip};

export const CustomChipExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
