'use client'

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import React, {FC, memo} from 'react';

export enum MENU_ITEM {
  GETTING_STARTED = 'Getting Started',
  API = 'API',
  BASIC = 'Basic',
  CONTROLLED = 'Controlled',
  VIRTUALIZATION = 'Virtualization',
  INFINITE_SCROLL = 'Infinite Scroll',
  COMPONENTS = 'Components',
  KEYBOARD_NAVIGATION = 'Keyboard Navigation',
}

const pathPageMap = new Map<string, MENU_ITEM>([
  ['/', MENU_ITEM.GETTING_STARTED],
  ['/api', MENU_ITEM.API],
  ['/basic', MENU_ITEM.BASIC],
  ['/controlled', MENU_ITEM.CONTROLLED],
  ['/virtualization', MENU_ITEM.VIRTUALIZATION],
  ['/infinite-scroll', MENU_ITEM.INFINITE_SCROLL],
  ['/components', MENU_ITEM.COMPONENTS],
  ['/keyboard-navigation', MENU_ITEM.KEYBOARD_NAVIGATION]
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
