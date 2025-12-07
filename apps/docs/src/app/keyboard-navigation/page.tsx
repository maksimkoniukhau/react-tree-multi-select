import {FC, memo} from 'react';
import Content from './mdx-page.mdx';

const KeyboardNavigationPage: FC = memo(() => {

  return (
    <div className="page-content" style={{marginBottom: '250px'}}>
      <Content/>
    </div>
  );
});

export default KeyboardNavigationPage;
