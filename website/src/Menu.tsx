import React, {FC, memo} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

export enum MENU_ITEM {
  GETTING_STARTED = 'Getting Started',
  API = 'API',
  BASIC = 'Basic',
  BIG_DATA = 'Big Data',
  COMPONENTS = 'Components'
}

const pathPageMap = new Map<string, MENU_ITEM>([
  ['/', MENU_ITEM.GETTING_STARTED],
  ['/api', MENU_ITEM.API],
  ['/basic', MENU_ITEM.BASIC],
  ['/big-data', MENU_ITEM.BIG_DATA],
  ['/components', MENU_ITEM.COMPONENTS]
]);

export interface MenuProps {
}

export const Menu: FC<MenuProps> = memo(() => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (entry: [string, MENU_ITEM]) => (e: React.MouseEvent): void => {
    navigate(entry[0]);
    window.scrollTo(0, 0);
  };

  return (
    <ul className="menu">
      {Array.from(pathPageMap.entries())
        .map((entry: [string, MENU_ITEM], idx: number) => (
          <li
            key={idx}
            className={`menu-item ${location.pathname === entry[0] ? ' selected' : ''}`}
            onClick={handleMenuItemClick(entry)}
          >
            <span>{entry[1]}</span>
          </li>
        ))}
    </ul>
  );
});
