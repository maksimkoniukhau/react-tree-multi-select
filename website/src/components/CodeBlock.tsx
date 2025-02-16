import React, {FC} from 'react';
import Prism from 'prismjs';

export interface CodeBlockProps {
  code: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({code}) => {

  const codeExampleHtml = Prism.highlight(code, Prism.languages.javascript, 'typescript');

  return (
    <div className="code-container">
        <pre>
          <code className="language-ts" dangerouslySetInnerHTML={{__html: codeExampleHtml}}/>
        </pre>
    </div>
  );
};
