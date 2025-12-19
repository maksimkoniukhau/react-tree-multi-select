'use client'

import React, {FC} from 'react';
import {Heading} from '@/utils/headingUtils';
import {useTOCNavigation} from '@/hooks/useTOCNavigation';

interface TOCProps {
  headings: Heading[];
}

export const TOC: FC<TOCProps> = ({headings}) => {
  const activeId = useTOCNavigation(headings);

  return (
    <div className="toc-container">
      <nav className="toc">
        <ul className="navigation">
          {headings.map((heading, index) => (
            <li key={index} className="navigation-item">
              <a
                href={`#${heading.id}`}
                style={{paddingLeft: heading.level === 3 ? '15px' : undefined}}
                className={`nav-link${activeId === heading.id ? ' active' : ''}`}
              >
                <span>{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
