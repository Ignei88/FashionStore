// src/components/SubMenu.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubMenu = ({ items }) => {
  const location = useLocation();

  return (
    <div className="submenu">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`submenu-item ${location.pathname.includes(item.path) ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default SubMenu;