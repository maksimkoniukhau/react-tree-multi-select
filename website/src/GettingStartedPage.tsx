import React, {FC} from 'react';
import {basicUsageCode} from './code-data';
import {CodeBlock} from './CodeBlock';

export const GettingStartedPage: FC = () => {

  return (
    <div className="page">
      <div className="page-content">
        <h2>{'Getting Started with RTS tree select'}</h2>
        <h3 className="title">{'Installation:'}</h3>
        <div className="paragraph">
          {'RTS is distributed as an NPM package.\n'}
          {'In order to use, install rts in your React project.'}
        </div>
        <CodeBlock code={'npm install rts'}/>
        <h3 className="title">Usage:</h3>
        <CodeBlock code={basicUsageCode}/>
      </div>
      <div className="page-navigation"></div>
    </div>
  );
};
