import {FC, memo} from 'react';
import {getHeadings} from '@/utils/headingUtils';
import {loadDocsSource} from '@/utils/fsUtils';
import {TOC} from '@/shared-components/TOC';
import Content from './mdx-page.mdx';

const ApiPage: FC = () => {

  const headings = getHeadings(loadDocsSource('api/mdx-page.mdx'));

  return (
    <>
      <div className="page-content api-page">
        <Content/>
      </div>
      <TOC headings={headings}/>
    </>
  );
};

export default ApiPage;
