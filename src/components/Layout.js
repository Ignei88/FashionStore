// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <main className="main-content">
        <div className="option-container">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;