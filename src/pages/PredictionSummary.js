import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionSummary = () => {
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas 2023',
        data: [12000, 19000, 15000, 18000, 21000, 19500],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Ventas 2024 (proyección)',
        data: [15000, 22000, 18000, 20000, null, null],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <div className="sales-history-container compact-container">
      <div className="card compact-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.11)' }}>
        <h3 className="compact-title">Tendencia de Ventas Anual</h3>
        <div style={{ height: '400px', padding: '15px' }}>
          <Bar
            data={salesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Ventas ($)',
                  },
                },
              },
            }}
          />
        </div>
        <div className="sale-info compact-info">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Proyección basada en:</strong> Histórico de ventas 2023</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;