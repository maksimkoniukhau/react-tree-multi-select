import React, {FC, useMemo} from 'react';
import {ChipLabelProps, Components, TreeMultiSelect} from '../../treeMultiSelectImport';
import {getTreeNodeData} from '../../utils';

interface CustomChipLabelProps {
  suffix: string;
}

const CustomChipLabel: FC<ChipLabelProps<CustomChipLabelProps>> = (props) => (
  <div {...props.attributes}>
    {props.ownProps.label}{'-'}{props.customProps.suffix}
  </div>
);

export const CustomChipLabelExample: FC = () => {

  const data = useMemo(() => getTreeNodeData(true), []);

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
        components={components}
      />
    </div>
  );
};
