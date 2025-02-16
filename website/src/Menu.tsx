import React, {FC, memo} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

export enum MENU_ITEM {
  GETTING_STARTED = 'Getting Started',
  API = 'API',
  BASIC = 'Basic',
  BIG_DATA = 'Big Data',
  CUSTOM_COMPONENTS = 'Custom Components'
}

const pathPageMap = new Map<string, MENU_ITEM>([
  ['/react-tree-multi-select/', MENU_ITEM.GETTING_STARTED],
  ['/react-tree-multi-select/api', MENU_ITEM.API],
  ['/react-tree-multi-select/basic', MENU_ITEM.BASIC],
  ['/react-tree-multi-select/big-data', MENU_ITEM.BIG_DATA],
  ['/react-tree-multi-select/custom-components', MENU_ITEM.CUSTOM_COMPONENTS]
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
