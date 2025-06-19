import React, {FC} from 'react';
import {Components, TreeMultiSelect} from '../../treeMultiSelectImport';
import {getTreeNodeData} from '../../utils';
import {FooterProps, FooterType} from '../../../../src';

const CustomFooter: FC<FooterProps> = (props) => (
  <div {...props.attributes}>
    <span style={{display: 'flex', justifyContent: 'center'}}>
      Footer component
    </span>
  </div>
);

const Footer: FooterType = {component: CustomFooter};
const components: Components = {Footer};

export const CustomFooterExample: FC = () => {

  return (
    <div className="component-example">
      <TreeMultiSelect
        data={getTreeNodeData(true, true)}
        components={components}
      />
    </div>
  );
};
