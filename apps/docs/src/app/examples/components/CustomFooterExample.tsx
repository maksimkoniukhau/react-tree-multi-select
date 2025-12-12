'use client'

import React, {FC, useState} from 'react';
import {Components, FooterProps, FooterType, TreeMultiSelect, TreeNode} from 'react-tree-multi-select';
import {getTreeNodeData} from '@/utils/utils';

const CustomFooter: FC<FooterProps> = (props) => {
  return (
    <div {...props.attributes} style={{display: 'flex', justifyContent: 'center', height: '22px'}}>
      {'Custom Footer'}
    </div>
  );
};

const Footer: FooterType = {component: CustomFooter};
const components: Components = {Footer};

export const CustomFooterExample: FC = () => {

  const [data] = useState<TreeNode[]>(getTreeNodeData());

  return (
    <div className="component-example">
      <TreeMultiSelect data={data} components={components}/>
    </div>
  );
};
