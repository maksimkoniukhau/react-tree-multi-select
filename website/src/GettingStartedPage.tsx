import React, {FC} from 'react';
import {basicUsageCode} from './code-data';
import {CodeBlock} from './CodeBlock';

export const GettingStartedPage: FC = () => {

  return (
    <div className="page">
      <h3>{'Getting Started with RTS tree select'}</h3>
      <div className="title">{'Installation:'}</div>
      <div className="paragraph">
        {'RTS is distributed as an NPM package.\n'}
        {'In order to use, install rts in your React project.'}
      </div>
      <CodeBlock code={'npm install rts'}/>
      <div className="title">Usage:</div>
      <CodeBlock code={basicUsageCode}/>
    </div>
  );
};
