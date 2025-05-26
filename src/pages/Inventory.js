import React from 'react';
import { Outlet } from 'react-router-dom';
import SubMenu from '../components/SubMenu';

// Modificamos el array para eliminar la opción de Historial de Compras
const inventorySubMenuItems = [
  { path: '/inventory/products', label: 'Lista de Productos' },
  // Eliminamos la opción de historial de compras
];

const Inventory = ({ isMobile }) => {
  return (
    <div className="sales-container">
      <SubMenu items={inventorySubMenuItems} />
      <div className="sales-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Inventory;