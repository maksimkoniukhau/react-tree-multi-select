import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFire} from '@fortawesome/free-solid-svg-icons';
import {ChipProps, ComponentProps, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

interface CustomChipProps {
  icon: ReactNode;
}

const CustomChip: FC<ComponentProps<ChipProps, CustomChipProps>> = (props) => (
  <div {...props.rootAttributes}>
    <div>{props.ownProps.icon}</div>
    {props.children}
  </div>
);

export const CustomChipExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={{
          Chip: {component: CustomChip, props: {icon: <FontAwesomeIcon icon={faFire}/>}}
        }}
      />
    </div>
  );
};
