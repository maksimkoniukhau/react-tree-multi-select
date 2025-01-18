import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import {ChipLabelProps, ChipLabelType, Components, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomChipLabel: FC<ChipLabelProps> = (props) => (
  <div {...props.componentAttributes}>
    <FontAwesomeIcon icon={faCode}/>{' '}{props.componentProps.label}{' '}<FontAwesomeIcon icon={faCode}/>
  </div>
);

const ChipLabel: ChipLabelType = {component: CustomChipLabel};
const components: Components = {ChipLabel};

export const CustomChipLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
