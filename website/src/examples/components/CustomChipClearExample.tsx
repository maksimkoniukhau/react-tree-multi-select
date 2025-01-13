import React, {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ChipClearProps, ChipClearType, Components, TreeSelect} from '../../../../src';
import {getTreeNodeData} from '../../utils';

const CustomChipClear: FC<ChipClearProps> = (props) => (
  <div {...props.componentAttributes}>
    <div><FontAwesomeIcon icon={faTrash}/></div>
  </div>
);

const ChipClear: ChipClearType = {component: CustomChipClear};
const components: Components = {ChipClear};

export const CustomChipClearExample: FC = () => {

  return (
    <div className="component-example">
      <TreeSelect
        data={getTreeNodeData(true)}
        components={components}
      />
    </div>
  );
};
