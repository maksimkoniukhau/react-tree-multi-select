import React, {FC, memo, useState} from 'react';
import {CodeBlock} from '@/shared-components/CodeBlock';

export interface DemoContainerProps {
  code: string;
  children: React.ReactNode;
}

export const DemoContainer: FC<DemoContainerProps> = memo(({code, children}) => {

  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);

  return (
    <div className="demo-container">
      <button className="btn" onClick={() => setIsCodeOpen(!isCodeOpen)}>
        {isCodeOpen ? 'Hide code' : 'Show code'}
      </button>
      {isCodeOpen && <CodeBlock code={code}/>}
      {children}
    </div>
  );
});
