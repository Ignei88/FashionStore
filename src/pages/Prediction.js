import React from 'react';
import { Outlet } from 'react-router-dom';
import SubMenu from '../components/SubMenu';

const predictionSubMenuItems = [
  { path: '/prediction/summary', label: 'Resumen de ventas' },
  { path: '/prediction/top-products', label: 'Productos más vendidos' },
  { path: '/prediction/forecast', label: 'Predicción de demanda' },
  { path: '/prediction/print-report', label: 'Imprimir informe' }
];

const Prediction = ({ isMobile }) => {
  return (
    <div className="sales-container">
      <SubMenu items={predictionSubMenuItems} />
      <div className="sales-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Prediction;