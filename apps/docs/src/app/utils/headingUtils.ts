import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

export type Heading = {
  id: string;
  text: string;
  level: number;
}

export const getHeadings = (source: string): Heading[] => {
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(source);

  const headings: Heading[] = [];

  const visit = (node: any): void => {
    if (node.type === 'heading') {
      const text = node.children
        .filter((n: any) => n.type === 'text')
        .map((n: any) => n.value)
        .join('');

      const id = slugify(text);

      headings.push({
        id: node.depth === 1 ? `nav-overview-${id}` : `nav-${id}`,
        text: node.depth === 1 ? 'Overview' : text,
        level: node.depth
      });
    }
    if (node.children) {
      node.children.forEach(visit);
    }
  };

  visit(tree);
  return headings;
};

export const slugify = (text: string): string => {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
};
