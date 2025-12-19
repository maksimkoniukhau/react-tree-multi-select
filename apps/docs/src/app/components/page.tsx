import {FC, memo} from 'react';
import {getHeadings} from '@/utils/headingUtils';
import {loadDocsSource} from '@/utils/fsUtils';
import {TOC} from '@/shared-components/TOC';
import Content from './mdx-page.mdx';

const ComponentsPage: FC = memo(() => {

  const headings = getHeadings(loadDocsSource('components/mdx-page.mdx'));

  return (
    <>
      <div className="page-content" style={{marginBottom: '250px'}}>
        <Content/>
      </div>
      <TOC headings={headings}/>
    </>
  );
});

export default ComponentsPage;
