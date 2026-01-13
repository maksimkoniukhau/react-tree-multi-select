import React, {FC} from 'react';
import {createHighlighter} from 'shiki';

const highlighter = await createHighlighter({themes: ['light-plus'], langs: ['typescript']});
await highlighter.loadLanguage('typescript');

export interface CodeBlockProps {
  code: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({code}) => {

  const html = highlighter.codeToHtml(code ?? '', {lang: 'typescript', theme: 'light-plus'});

  return (
    <div className="code-container" dangerouslySetInnerHTML={{__html: html}}/>
  );
};
