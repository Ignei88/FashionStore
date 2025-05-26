import React, {useState, useEffect} from 'react';

const TopProducts = () => {
  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
  
//  const topProducts = [
//    { codigo: 'PROD-001', nombre: 'Camiseta básica blanca', vendidos: 45, ganancias: 2250 },
//    { codigo: 'PROD-002', nombre: 'Jeans slim fit', vendidos: 32, ganancias: 3840 },
//    { codigo: 'PROD-003', nombre: 'Zapatos casuales', vendidos: 28, ganancias: 4200 },
//    { codigo: 'PROD-004', nombre: 'Chamarra de mezclilla', vendidos: 18, ganancias: 3600 },
//  ];

  const [topProducts, setTopProducts] = useState([]);

 useEffect(() => {
  const fetchTopProductos = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    try {
      const response = await fetch(`${apiUrl}/api/prediccion/productosMasVendidos`);
      if (!response.ok) throw new Error('Error al obtener los productos más vendidos');
      
      const data = await response.json();
      
      // Transforma los datos para que coincidan con tu estructura
      const transformedData = data.map(item => ({
        id_producto: item.id_producto,
        codigo: `PROD-${item.id_producto.toString().padStart(3, '0')}`,
        nombre: item.nombre_producto,
        vendidos: parseInt(item.total_vendidos),
        ganancias: parseInt(item.total_vendidos) * parseFloat(item.margen_ganancia), 
      }));
      
      setTopProducts(transformedData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  fetchTopProductos();
}, []);

  return (
    <div className="sales-history-container compact-container">
      <div className="card compact-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.11)' }}>
        <h3 className="compact-title">Productos más vendidos</h3>
        <p className="month-indicator">Mes: {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}</p>
        
        <table className="sales-table compact-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Vendidos</th>
              <th>Ganancias ($)</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.id_producto}>
                <td>{product.codigo}</td>
                <td>{product.nombre}</td>
                <td>{product.vendidos}</td>
                <td>{product.ganancias}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sale-info compact-info">
          <p><strong>Total unidades vendidas:</strong> {topProducts.reduce((sum, p) => sum + p.vendidos, 0)}</p>
          <p><strong>Ganancias totales:</strong> ${topProducts.reduce((sum, p) => sum + p.ganancias, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;