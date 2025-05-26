import React from 'react';
import { Outlet } from 'react-router-dom';
import SubMenu from '../components/SubMenu';

const staffSubMenuItems = [
  { path: '/staff/list', label: 'Lista de personal' },
];

const Staff = ({ isMobile }) => {
  return (
    <div className="sales-container">
      <SubMenu items={staffSubMenuItems} />
      <div className="sales-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Staff;