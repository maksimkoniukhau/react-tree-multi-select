import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.scss';
import {Menu} from './Menu';
import {GettingStartedPage} from './GettingStartedPage';
import {ApiPage} from './ApiPage';
import {BasicPage} from './BasicPage';
import {BigDataPage} from './BigDataPage';
import {CustomComponentsPage} from './CustomComponentsPage';

function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <div className="header">
          <h1 className="header-title">{'REACT TREE MULTI SELECT'}</h1>
        </div>
        <div className="content">
          <div className="menu-container">
            <Menu/>
          </div>
          <div className="page-container">
            <Routes>
              <Route path="/" element={<GettingStartedPage/>}/>
              <Route path="/api" element={<ApiPage/>}/>
              <Route path="/basic" element={<BasicPage/>}/>
              <Route path="/big-data" element={<BigDataPage/>}/>
              <Route path="/custom-components" element={<CustomComponentsPage/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
