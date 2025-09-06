'use client'

import React, {FC} from 'react';
import {basicUsageCode} from '@/utils/code-data';
import {CodeBlock} from '@/shared-components/CodeBlock';
import {Section} from '@/shared-components/Section';

const Home: FC = () => {
  return (
    <div className="page-content">
      <h2>{'Getting Started'}</h2>
      <Section id="installation">
        <h3 className="title">{'Installation:'}</h3>
        <div className="paragraph">
          <b>{'react-tree-multi-select'}</b>{' is distributed as an NPM package.\n'}
          {'In order to use, install '}<b>{'react-tree-multi-select'}</b>{' in your React project.'}
        </div>
        <CodeBlock code={'npm install react-tree-multi-select'}/>
      </Section>
      <Section id="usage">
        <h3 className="title">{'Usage:'}</h3>
        <CodeBlock code={basicUsageCode}/>
      </Section>
    </div>
  );
};

export default Home;
