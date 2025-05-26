import React from 'react';
import { Outlet } from 'react-router-dom';
import SubMenu from '../components/SubMenu';

// Modificamos los items del submenu para eliminar las devoluciones
const salesSubMenuItems = [
  { path: '/sales/register', label: 'Registrar venta' },
  { path: '/sales/history', label: 'Historial de ventas' },
  { path: '/sales/today', label: 'Ventas de hoy' },
  // Se eliminó la opción de devoluciones
];

const Sales = ({ isMobile }) => {
  return (
    <div className="sales-container">
      <SubMenu items={salesSubMenuItems} />
      <div className="sales-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sales;