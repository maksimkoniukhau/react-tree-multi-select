import {FC, memo} from 'react';
import Content from './mdx-page.mdx';

const AsyncPage: FC = memo(() => {

  return (
    <div className="page-content">
      <Content/>
    </div>
  );
});

export default AsyncPage;