import {FC, memo} from 'react';
import Content from './mdx-page.mdx';

const ControlledPage: FC = memo(() => {

  return (
    <div className="page-content" style={{marginBottom: '250px'}}>
      <Content/>
    </div>
  );
});

export default ControlledPage;