import type {MDXComponents} from 'mdx/types';

const components = {
  p: ({children}) => (
    <p style={{lineHeight: '1.5'}}>{children}</p>
  )
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => {
  return components;
};
