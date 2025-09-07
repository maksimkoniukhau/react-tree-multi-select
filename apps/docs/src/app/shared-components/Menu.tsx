'use client'

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import React, {FC, memo} from 'react';

export enum MENU_ITEM {
  GETTING_STARTED = 'Getting Started',
  API = 'API',
  BASIC = 'Basic',
  CONTROLLED = 'Controlled',
  LARGE_DATA = 'Large Data',
  INFINITE_SCROLL = 'Infinite Scroll',
  COMPONENTS = 'Components'
}

const pathPageMap = new Map<string, MENU_ITEM>([
  ['/', MENU_ITEM.GETTING_STARTED],
  ['/api', MENU_ITEM.API],
  ['/basic', MENU_ITEM.BASIC],
  ['/controlled', MENU_ITEM.CONTROLLED],
  ['/large-data', MENU_ITEM.LARGE_DATA],
  ['/infinite-scroll', MENU_ITEM.INFINITE_SCROLL],
  ['/components', MENU_ITEM.COMPONENTS]
]);

export const Menu: FC = memo(() => {

  const pathname = usePathname();

  return (
    <div className="menu-container">
      <nav className="menu-navigation">
        <ul className="menu">
          {Array.from(pathPageMap.entries())
            .map((entry: [string, MENU_ITEM], idx: number) => (
              <li key={idx} className={`menu-item ${pathname === entry[0] ? ' selected' : ''}`}>
                <Link href={entry[0]}>{entry[1]}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
});
