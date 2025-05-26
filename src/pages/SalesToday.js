import React, { useState, useEffect } from 'react';
import '../styles/General.css';

const SalesToday = () => {
  const [ventasHoy, setVentasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Cargar datos de ventas de hoy
  useEffect(() => {
    const fetchVentasHoy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/ventas/ventas/hoy`);
        if (!response.ok) {
          throw new Error('Error al obtener ventas de hoy');
        }
        const data = await response.json();
        setVentasHoy(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar ventas de hoy:', err);
        setError('Error al cargar ventas de hoy: ' + err.message);
        setLoading(false);
      }
    };

    fetchVentasHoy();
  }, [apiUrl]);

  // Calcular el total de todas las ventas
  const totalHoy = ventasHoy.reduce((sum, venta) => sum + parseFloat(venta.total_vendido || 0), 0);
  
  // Calcular ganancias estimadas (30% del total)
  const gananciasHoy = totalHoy * 0.30;
  
  // Calcular total de ventas realizadas
  const totalVentasRealizadas = ventasHoy.reduce((sum, venta) => sum + parseInt(venta.ventas_realizadas || 0), 0);

  return (
    <div className="sales-history-container compact-container">
      <div className="card compact-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.11)' }}>
        
        {loading ? (
          <div className="loading-message">Cargando ventas de hoy...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : ventasHoy.length === 0 ? (
          <div className="no-data-message">No hay ventas registradas hoy</div>
        ) : (
          <>
            <table className="sales-table compact-table">
              <thead>
                <tr>
                  <th>ID Usuario</th>
                  <th>Ventas Realizadas</th>
                  <th>Total Vendido</th>
                </tr>
              </thead>
              <tbody>
                {ventasHoy.map((venta) => (
                  <tr key={venta.id_usuario}>
                    <td>Usuario ID: {venta.id_usuario}</td>
                    <td>{venta.ventas_realizadas}</td>
                    <td>${parseFloat(venta.total_vendido).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '25px' }}>Total Hoy:</td>
                  <td style={{ fontWeight: 'bold', fontSize: '25px' }}>${totalHoy.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '25px' }}>Ganancias Hoy:</td>
                  <td style={{ fontWeight: 'bold', fontSize: '25px', color: '#4CAF50' }}>${gananciasHoy.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="sale-info compact-info">
              <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Total de Vendedores:</strong> {ventasHoy.length}</p>
              <p><strong>Ventas Totales:</strong> {totalVentasRealizadas}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesToday;