import React, {FC, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import {ChipLabelProps, ComponentProps, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

interface CustomChipLabelProps {
  icon: ReactNode;
}

const CustomChipLabel: FC<ComponentProps<ChipLabelProps, CustomChipLabelProps>> = (props) => (
  <div {...props.rootAttributes}>
    <div className="custom-label">
      {props.ownProps.icon}{' '}{props.componentProps.label}{' '}{props.ownProps.icon}
    </div>
  </div>
);

export const CustomChipLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={{
          ChipLabel: {component: CustomChipLabel, props: {icon: <FontAwesomeIcon icon={faCode}/>}}
        }}
      />
    </div>
  );
};
