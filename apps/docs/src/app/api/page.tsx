import React, {FC} from 'react';
import {rtmsProps, rtmsTypes} from '@/utils/api-data';
import {CodeBlock} from '@/shared-components/CodeBlock';
import {PageNavigation} from '@/shared-components/PageNavigation';
import {Section} from '@/shared-components/Section';

const ApiPage: FC = () => {

  return (
    <>
      <div className="page-content api-page">
        <Section id="types">
          <h2>{'API'}</h2>
          <h3 className="title">{'TreeMultiSelect types'}</h3>
          <CodeBlock code={rtmsTypes}/>
        </Section>
        <Section id="props">
          <h3 className="title">{'TreeMultiSelect props'}</h3>
          <CodeBlock code={rtmsProps}/>
        </Section>
      </div>
      <PageNavigation
        items={[
          {link: '#types', label: 'Types'},
          {link: '#props', label: 'Props'}
        ]}
      />
    </>
  );
};

export default ApiPage;
