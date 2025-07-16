import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.scss';
import {useNavigation} from './hooks/useNavigation';
import {Menu} from './Menu';
import {GettingStartedPage} from './pages/GettingStartedPage';
import {ApiPage} from './pages/ApiPage';
import {BasicPage} from './pages/BasicPage';
import {LargeDataPage} from './pages/LargeDataPage';
import {InfiniteScrollPage} from './pages/InfiniteScrollPage';
import {ComponentsPage} from './pages/ComponentsPage';
import {ControlledPage} from './pages/ControlledPage';

function App() {

  useNavigation();

  return (
    <Router basename="/react-tree-multi-select">
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
              <Route path="/controlled" element={<ControlledPage/>}/>
              <Route path="/large-data" element={<LargeDataPage/>}/>
              <Route path="/infinite-scroll" element={<InfiniteScrollPage/>}/>
              <Route path="/components" element={<ComponentsPage/>}/>
            </Routes>
          </div>
        </div>
        <div className="footer">
          {'Copyright © Maksim Koniukhau, 2025. MIT Licensed.'}
        </div>
      </div>
    </Router>
  );
}

export default App;
