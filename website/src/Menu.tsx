import React, {FC, memo, useState} from 'react';

export enum MENU_ITEM {
  GETTING_STARTED = 'Getting Started',
  API = 'API',
  BASIC = 'Basic',
  BIG_DATA = 'Big Data',
  SELECT = "Select"
}

const menuItems = [MENU_ITEM.GETTING_STARTED, MENU_ITEM.API, MENU_ITEM.BASIC, MENU_ITEM.BIG_DATA, MENU_ITEM.SELECT];

export interface MenuProps {
  onMenuItemClick: (menuitem: MENU_ITEM) => void;
}

export const Menu: FC<MenuProps> = memo(({onMenuItemClick}) => {

  const [menuItem, setMenuItem] = useState<MENU_ITEM>(MENU_ITEM.GETTING_STARTED);

  const handleMenuItemClick = (clickedItem: MENU_ITEM) => (e: React.MouseEvent<Element>): void => {
    setMenuItem(clickedItem);
    onMenuItemClick(clickedItem);
  };

  return (
    <ul className="menu">
      {menuItems
        .map((item: MENU_ITEM, idx: number) => (
          <li
            key={idx}
            className={`menu-item ${menuItem === item ? ' selected' : ''}`}
            onClick={handleMenuItemClick(item)}
          >
            <span>{item}</span>
          </li>
        ))}
    </ul>
  );
});
