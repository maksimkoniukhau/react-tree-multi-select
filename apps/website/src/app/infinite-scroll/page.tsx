'use client'

import React, {FC, memo} from 'react';
import {infiniteScrollExample} from '@/utils/code-data';
import {CodeBlock} from '@/shared-components/CodeBlock';
import {Alert} from '@/shared-components/Alert';
import {PageNavigation} from '@/shared-components/PageNavigation';
import {InfiniteScrollExample} from '@/examples/InfiniteScrollExample';

const InfiniteScrollPage: FC = memo(() => {

  return (
    <div className="page" style={{paddingBottom: '150px'}}>
      <div className="page-content">
        <h2>{'Infinite Scroll'}</h2>
        <div className="paragraph">
          <div className="paragraph">
            {`You can implement infinite scrolling by using the onDropdownLastItemReached callback.`}
          </div>
          <Alert
            type={'note'}
            text={`The onDropdownLastItemReached callback is triggered when the last item (including overscan) is rendered. 
            The component uses overscan to render a small number of additional items just outside the visible area for smoother scrolling. 
            By default, it overscans 2 items above and below the visible range.`}
          />
        </div>
        <CodeBlock code={infiniteScrollExample}/>
        <InfiniteScrollExample/>
      </div>
      <PageNavigation items={[]}/>
    </div>
  );
});

export default InfiniteScrollPage;
