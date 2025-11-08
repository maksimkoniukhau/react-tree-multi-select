'use client'

import React, {FC, memo} from 'react';
import {largeDataExample, nonVirtualizedExample} from '@/utils/code-data';
import {Alert} from '@/shared-components/Alert';
import {CodeBlock} from '@/shared-components/CodeBlock';
import {NonVirtualizedExample} from '@/examples/NonVirtualizedExample';
import {LargeDataExample} from '@/examples/LargeDataExample';

const VirtualizationPage: FC = memo(() => {

  return (
    <div className="page-content" style={{marginBottom: '250px'}}>
      <h2>{'Virtualization'}</h2>
      <div className="paragraph">
        {'By default, '}<b>{'react-tree-multi-select'}</b>{` uses virtualization to render items efficiently.
        Virtualization helps improve performance by only rendering the visible portion of a large list, which makes it the recommended choice in most cases.
        The following example demonstrates the component rendering a large number of nodes with virtualization enabled.`}
      </div>
      <CodeBlock code={largeDataExample}/>
      <LargeDataExample/>
      <h3 className="title">{'Disabling Virtualization'}</h3>
      <div className="paragraph">
        {`You can disable virtualization by passing the isVirtualized={false} prop.
        A common reason to do this is when you want the dropdown width to automatically adjust to the size of its content.
        Virtualization uses absolute positioning for list items and only renders a subset of them at a time, which prevents the dropdown from resizing based on its full content.`}
      </div>
      <div className="paragraph">
        {`To disable virtualization and make the dropdown adjust its width automatically:
        1. Pass isVirtualized={false} to your component.
        2. Add width: auto; to the .rtms-dropdown class in your styles.`}
      </div>
      <Alert type={'important'}>
        {'Only disable virtualization if you have a relatively small number of items, since rendering all items at once can reduce performance.'}
      </Alert>
      <div className="paragraph">
        {`This example demonstrates the component when virtualization is disabled, allowing the dropdown to resize automatically.`}
      </div>
      <CodeBlock code={nonVirtualizedExample}/>
      <NonVirtualizedExample/>
    </div>
  );
});

export default VirtualizationPage;
