import React, {FC} from 'react';
import {rtmsProps, rtmsTypes} from '../api-data';
import {CodeBlock} from '../components/CodeBlock';
import {PageNavigation} from '../components/PageNavigation';
import {Section} from '../components/Section';

export const ApiPage: FC = () => {

  return (
    <div className="page">
      <div className="page-content api-page">
        <Section id="types">
          <h2>{'API'}</h2>
          <h3 className="title">{'TreeMultiSelect types:'}</h3>
          <CodeBlock code={rtmsTypes}/>
        </Section>
        <Section id="props">
          <h3 className="title">{'TreeMultiSelect props:'}</h3>
          <CodeBlock code={rtmsProps}/>
        </Section>
      </div>
      <PageNavigation
        items={[
          {link: '#types', label: 'Types'},
          {link: '#props', label: 'Props'}
        ]}
      />
    </div>
  );
};
