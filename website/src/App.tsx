import React, {JSX, useCallback, useState} from 'react';
import './App.scss';
import {Menu, MENU_ITEM} from './Menu';
import {GettingStartedPage} from './GettingStartedPage';
import {ApiPage} from './ApiPage';
import {BasicPage} from './BasicPage';
import {BigDataPage} from './BigDataPage';
import {CustomComponentsPage} from './CustomComponentsPage';

function App() {

  const [page, setPage] = useState<MENU_ITEM>(MENU_ITEM.GETTING_STARTED);

  const handleMenuItemClick = useCallback((menuitem: MENU_ITEM): void => {
    setPage(menuitem);
  }, []);

  const getPage = useCallback((): JSX.Element => {
    switch (page) {
      case MENU_ITEM.API:
        return (<ApiPage/>);
      case MENU_ITEM.BASIC:
        return (<BasicPage/>);
      case MENU_ITEM.BIG_DATA:
        return (<BigDataPage/>);
      case MENU_ITEM.CUSTOM_COMPONENTS:
        return (<CustomComponentsPage/>)
      default:
        return (<GettingStartedPage/>);
    }
  }, [page]);

  return (
    <div className="app">
      <div className="header">
        <h1 className="header-title">{'REACT TREE MULTI SELECT'}</h1>
      </div>
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
