import type {MDXComponents} from 'mdx/types';
import {slugify} from '@/utils/headingUtils';

const components = {
  p: ({children}) => (
    <p style={{lineHeight: '1.5'}}>{children}</p>
  ),
  h1: ({children}: { children: string }) => (
    <h1 id={`nav-overview-${slugify(children)}`}>{children}</h1>
  ),
  h2: ({children}: { children: string }) => (
    <h2 id={`nav-${slugify(children)}`}>{children}</h2>
  ),
  h3: ({children}: { children: string }) => (
    <h3 id={`nav-${slugify(children)}`}>{children}</h3>
  )
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => {
  return components;
};
