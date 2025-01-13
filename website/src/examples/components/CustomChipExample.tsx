import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFire} from '@fortawesome/free-solid-svg-icons';
import {ChipProps, ChipType, Components, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

interface CustomChipProps {
  icon: ReactNode;
}

const CustomChip: FC<ChipProps<CustomChipProps>> = (props) => (
  <div {...props.componentAttributes}>
    <div>{props.customProps.icon}</div>
    {props.children}
  </div>
);

const Chip: ChipType<CustomChipProps> = {
  component: CustomChip,
  props: {icon: <FontAwesomeIcon icon={faFire}/>}
};

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
