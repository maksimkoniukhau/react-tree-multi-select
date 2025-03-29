import React, {FC} from 'react';
import {ChipLabelProps, TreeMultiSelect} from '../../treeMultiSelectImport';
import {getTreeNodeData} from '../../utils';

interface CustomChipLabelProps {
  suffix: string;
}

const CustomChipLabel: FC<ChipLabelProps<CustomChipLabelProps>> = (props) => (
  <div {...props.componentAttributes}>
    {props.componentProps.label}{'-'}{props.customProps.suffix}
  </div>
);

export const CustomChipLabelExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true)}
        components={{ChipLabel: {component: CustomChipLabel, props: {suffix: 'Yo'}}}}
      />
    </div>
  );
};
