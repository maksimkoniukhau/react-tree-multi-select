import React, {FC, memo} from 'react';

export interface PageNavigationProps {
  items: { link: string, label: string }[];
}

export const PageNavigation: FC<PageNavigationProps> = memo(({items}) => {

  return (
    <nav className="page-navigation">
      <ul className="navigation">
        {items.map((item, index) => (
          <li key={index} className="navigation-item">
            <a href={item.link} className="nav-link">
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
