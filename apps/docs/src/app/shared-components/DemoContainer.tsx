'use client'

import React, {FC, memo, ReactNode, useState} from 'react';
import {CodeBlock} from '@/shared-components/CodeBlock';

export interface DemoContainerProps {
  code: string;
  children: ReactNode;
  title?: string;
}

export const DemoContainer: FC<DemoContainerProps> = memo(({code, children, title}) => {

  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);

  return (
    <div className="demo-container">
      <div className="demo-header">
        <div className="demo-title">{title}</div>
        <button className="btn" onClick={() => setIsCodeOpen(!isCodeOpen)}>
          {isCodeOpen ? 'Hide code' : 'Show code'}
        </button>
      </div>
      {isCodeOpen && <CodeBlock code={code}/>}
      {children}
    </div>
  );
});
