import {FC, memo} from 'react';
import Content from './mdx-page.mdx';

const VirtualizationPage: FC = memo(() => {

  return (
    <div className="page-content">
      <Content/>
    </div>
  );
});

export default VirtualizationPage;