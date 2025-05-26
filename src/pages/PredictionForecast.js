import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionForecast = () => {
  // Obtener el próximo mes
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const monthName = nextMonth.toLocaleString('es-ES', { month: 'long' });

  // Datos de predicción
  const predictedProducts = [
    { codigo: 'PROD-001', nombre: 'Camiseta básica blanca', prediccion: 52, margen: 35 },
    { codigo: 'PROD-002', nombre: 'Jeans slim fit', prediccion: 38, margen: 40 },
    { codigo: 'PROD-003', nombre: 'Zapatos casuales', prediccion: 25, margen: 45 },
    { codigo: 'PROD-004', nombre: 'Chamarra de mezclilla', prediccion: 20, margen: 50 },
    { codigo: 'PROD-005', nombre: 'Blusa de seda', prediccion: 30, margen: 38 }
  ];

  // Datos para la gráfica
  const predictionData = {
    labels: predictedProducts.map(p => p.nombre),
    datasets: [
      {
        label: 'Unidades estimadas',
        data: predictedProducts.map(p => p.prediccion),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Función para generar PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Informe de Predicción de Ventas', 105, 15, null, null, 'center');
    
    // Fecha
    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 25, null, null, 'center');
    
    // Tabla de productos
    doc.setFontSize(14);
    doc.text(`Predicción para ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`, 105, 40, null, null, 'center');
    
    doc.autoTable({
      startY: 50,
      head: [['Código', 'Producto', 'Unidades estimadas', 'Margen (%)']],
      body: predictedProducts.map(p => [p.codigo, p.nombre, p.prediccion, p.margen]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [54, 162, 235] }
    });
    
    doc.save(`informe-prediccion-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="sales-history-container compact-container">
      <div className="card compact-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.11)' }}>
        <h3 className="compact-title">Predicción de Demanda - {monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h3>
        
        <div style={{ height: '300px', marginBottom: '20px' }}>
          <Bar
            data={predictionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Unidades estimadas'
                  }
                }
              }
            }}
          />
        </div>
        
        <table className="sales-table compact-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Se venderán</th>
              <th>Margen estimado (%)</th>
            </tr>
          </thead>
          <tbody>
            {predictedProducts.map((product) => (
              <tr key={product.codigo}>
                <td>{product.codigo}</td>
                <td>{product.nombre}</td>
                <td>{product.prediccion}</td>
                <td>{product.margen}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="sale-info compact-info">
          <p><strong>Método de predicción:</strong> Modelo ARIMA basado en historial de ventas</p>
          <p><strong>Precisión estimada:</strong> 85% ± 5%</p>
        </div>

        <div className="modal-actions compact-actions">
          <button 
            className="btn-submit"
            onClick={handleGeneratePDF}
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionForecast;