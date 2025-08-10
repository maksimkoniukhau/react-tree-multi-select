import './globals.scss';
import React from 'react';
import {Menu} from '@/Menu';

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
    <body>
    <div className="app">
      <div className="header">
        <h1 className="header-title">{'REACT TREE MULTI SELECT'}</h1>
      </div>
      <div className="content">
        <div className="menu-container">
          <Menu/>
        </div>
        <div className="page-container">
          {children}
        </div>
      </div>
      <div className="footer">
        {'Copyright © Maksim Koniukhau, 2025. MIT Licensed.'}
      </div>
    </div>
    </body>
    </html>
  );
}
