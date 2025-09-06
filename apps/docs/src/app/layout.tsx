import './globals.scss';

import {Metadata} from 'next';
import React from 'react';
import {Menu} from '@/shared-components/Menu';

export const metadata: Metadata = {
  title: "react-tree-multi-select docs",
  description: "A fast, highly customizable and feature-rich component that combines tree select, multi-select and " +
    "simple select functionality into a single versatile solution.",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
    <body>
    <div className="app">
      <header className="header">
        <h1 className="header-title">{'REACT TREE MULTI SELECT'}</h1>
      </header>
      <main className="content">
        <Menu/>
        {children}
      </main>
      <footer className="footer">
        <span>{'Copyright © Maksim Koniukhau, 2025. MIT Licensed.'}</span>
      </footer>
    </div>
    </body>
    </html>
  );
}
