import React, {FC} from 'react';
import {basicUsageCode} from '../code-data';
import {CodeBlock} from '../components/CodeBlock';
import {PageNavigation} from '../components/PageNavigation';
import {Section} from '../components/Section';

export const GettingStartedPage: FC = () => {

  return (
    <div className="page">
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
      <PageNavigation items={[]}/>
    </div>
  );
};
