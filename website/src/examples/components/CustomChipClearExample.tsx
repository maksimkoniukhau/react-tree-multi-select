import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ComponentProps, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

interface CustomChipClearProps {
  icon: ReactNode;
}

const CustomChipClear: FC<ComponentProps<ChipClearProps, CustomChipClearProps>> = (props) => (
  <div {...props.rootAttributes}>
    <div className="custom-clear">{props.ownProps.icon}</div>
  </div>
);

export const CustomChipClearExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={{
          ChipClear: {component: CustomChipClear, props: {icon: <FontAwesomeIcon icon={faTrash}/>}}
        }}
      />
    </div>
  );
};
