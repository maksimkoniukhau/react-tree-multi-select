import React, {JSX, useCallback, useState} from 'react';
import './App.scss';
import {Menu, MENU_ITEM} from './Menu';
import {GetStartedPage} from './GetStartedPage';
import {BasicPage} from './BasicPage';
import {BigDataPage} from './BigDataPage';
import {SelectPage} from './SelectPage';

function App() {

  const [page, setPage] = useState<MENU_ITEM>(MENU_ITEM.GET_STARTED);

  const handleMenuItemClick = useCallback((menuitem: MENU_ITEM): void => {
    setPage(menuitem);
  }, []);

  const getPage = useCallback((): JSX.Element => {
    switch (page) {
      case MENU_ITEM.BASIC:
        return (<BasicPage/>);
      case MENU_ITEM.BIG_DATA:
        return (<BigDataPage/>);
      case MENU_ITEM.SELECT:
        return (<SelectPage/>);
      default:
        return (<GetStartedPage/>);
    }
  }, [page]);

  return (
    <div className="app">
      <h2 className="header">RTS tree select</h2>
      <div className="content">
        <div className="menu-container">
          <Menu onMenuItemClick={handleMenuItemClick}/>
        </div>
        <div className="page-container">
          {getPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
