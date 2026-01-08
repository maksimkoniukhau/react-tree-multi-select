import './globals.scss';

import {Metadata} from 'next';
import React from 'react';
import {COPYRIGHT_TEXT} from '@/const';
import {Header} from '@/shared-components/Header';
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
      <Header/>
      <main className="content">
        <Menu/>
        {children}
      </main>
      <footer className="footer">
        <span>{COPYRIGHT_TEXT}</span>
      </footer>
    </div>
    </body>
    </html>
  );
}
