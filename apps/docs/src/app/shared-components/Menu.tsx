'use client'

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import React, {FC, memo} from 'react';

export enum MENU_ITEM {
  GETTING_STARTED = 'Getting Started',
  BASIC = 'Basic',
  CONTROLLED = 'Controlled',
  VIRTUALIZATION = 'Virtualization',
  INFINITE_SCROLL = 'Infinite Scroll',
  ASYNC = 'Async',
  KEYBOARD_NAVIGATION = 'Keyboard Navigation',
  COMPONENTS = 'Components',
  API = 'API'
}

const pathPageMap = new Map<string, MENU_ITEM>([
  ['/', MENU_ITEM.GETTING_STARTED],
  ['/basic', MENU_ITEM.BASIC],
  ['/controlled', MENU_ITEM.CONTROLLED],
  ['/virtualization', MENU_ITEM.VIRTUALIZATION],
  ['/infinite-scroll', MENU_ITEM.INFINITE_SCROLL],
  ['/async', MENU_ITEM.ASYNC],
  ['/keyboard-navigation', MENU_ITEM.KEYBOARD_NAVIGATION],
  ['/components', MENU_ITEM.COMPONENTS],
  ['/api', MENU_ITEM.API]
]);

export interface MenuProps {
  onMenuItemClick?: () => void;
}

export const Menu: FC<MenuProps> = memo(({onMenuItemClick}) => {

  const pathname = usePathname();

  return (
    <div className="menu-container">
      <nav className="menu-navigation">
        <ul className="menu">
          {Array.from(pathPageMap.entries())
            .map((entry: [string, MENU_ITEM], idx: number) => (
              <li
                key={idx}
                className={`menu-item ${pathname === entry[0] ? ' selected' : ''}`}
                onClick={() => onMenuItemClick?.()}
              >
                <Link href={entry[0]}>{entry[1]}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
});
