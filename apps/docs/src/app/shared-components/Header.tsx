'use client'

import React, {FC, memo, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faXmark} from '@fortawesome/free-solid-svg-icons';
import {HEADER_TITLE} from '@/const';
import {Menu} from '@/shared-components/Menu';

export interface HeaderProps {
  libVersion: string;
}

export const Header: FC<HeaderProps> = memo(({libVersion}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <button className="btn menu-btn" onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon icon={faBars} size="xl" color="gray"/>
      </button>
      <h1 className="header-title">
        {HEADER_TITLE}<span className="header-version">{`v${libVersion}`}</span>
      </h1>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
      <div className={`overlay-menu${isOpen ? " open" : ""}`}>
        <div className="overlay-menu-header">
          <h4>{HEADER_TITLE}<span className="header-version">{`v${libVersion}`}</span></h4>
          <button className="btn close-btn" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faXmark} size="xl" color="gray"/>
          </button>
        </div>
        <Menu onMenuItemClick={() => setIsOpen(false)}/>
      </div>
    </header>
  );
});
