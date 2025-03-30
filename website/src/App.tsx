import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.scss';
import {useNavigation} from './hooks/useNavigation';
import {Menu} from './Menu';
import {GettingStartedPage} from './pages/GettingStartedPage';
import {ApiPage} from './pages/ApiPage';
import {BasicPage} from './pages/BasicPage';
import {BigDataPage} from './pages/BigDataPage';
import {ComponentsPage} from './pages/ComponentsPage';

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
              <Route path="/big-data" element={<BigDataPage/>}/>
              <Route path="/components" element={<ComponentsPage/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
