import React, {FC, useMemo, useState} from 'react';
import {ChipLabelProps, Components, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getBaseSelectedIds, getTreeNodeData} from '@/utils/utils';

interface CustomChipLabelProps {
  suffix: string;
}

const CustomChipLabel: FC<ChipLabelProps<CustomChipLabelProps>> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.label}{'-'}{props.customProps.suffix}
  </div>
);

export const CustomChipLabelExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());
  const [selectedIds] = useState<string[]>(getBaseSelectedIds());

  const components: Components = useMemo(() => (
    {
      ChipLabel: {
        component: CustomChipLabel,
        props: {suffix: 'Yo'}
      }
    }
  ), []);

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={data}
        selectedIds={selectedIds}
        components={components}
      />
    </div>
  );
};
