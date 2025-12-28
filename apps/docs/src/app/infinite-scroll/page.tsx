import React, {FC, memo} from 'react';
import Content from './mdx-page.mdx';

const InfiniteScrollPage: FC = memo(() => {

  return (
    <div className="page-content">
      <Content/>
    </div>
  );
});

export default InfiniteScrollPage;
