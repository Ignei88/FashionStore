import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import '../styles/General.css';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id_categoria: '',
    codigo_barras: '',
    nombre_producto: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  
  // Cargar datos de productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/productos/productos`);
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        const data = await response.json();
        // Filtramos los productos activos
        const productosActivos = data.filter(producto => producto.activo);
        setProductos(productosActivos);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos: ' + err.message);
        setLoading(false);
        console.error('Error al obtener productos:', err);
      }
    };

    fetchProductos();
  }, [apiUrl]);

  // Cargar categorías
// Reemplaza tu useEffect actual para categorías con este:
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        console.log('Intentando obtener categorías desde el frontend...');
        
        // Especificar completamente la URL y todos los parámetros
        const response = await fetch(`${apiUrl}/api/productos/categorias`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Asegura que las credenciales no interfieran (si no es una API protegida)
          credentials: 'omit'
        });
        
        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.error('La respuesta no es un array:', data);
        }
      } catch (err) {
        console.error('Error detallado al cargar categorías:', err);
        // Cargar categorías de respaldo para continuar con el desarrollo
        console.log('Cargando categorías estáticas como respaldo');
        setCategorias([
          { id_categoria: 1, nombre_categoria: 'Categoría 1' },
          { id_categoria: 2, nombre_categoria: 'Categoría 2' }
        ]);
      }
    };

    fetchCategorias();
  }, [apiUrl]);

  // Filtrar productos por ID
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return productos;
    
    return productos.filter(producto => {
      const idStr = String(producto.id_producto);
      return idStr.includes(searchTerm);
    });
  }, [productos, searchTerm]);

  const data = useMemo(() => filteredData, [filteredData]);
  // Añade esta función después de todas tus otras funciones, antes del return final
  const handleDelete = React.useCallback(async (id, nombre) => {
    if (window.confirm(`¿Está seguro que desea eliminar el producto "${nombre}"?`)) {
      try {
        const response = await fetch(`${apiUrl}/api/productos/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al eliminar el producto');
        }
        
        // Actualizar la lista de productos (filtrar el producto eliminado)
        setProductos(productos => productos.filter(producto => producto.id_producto !== id));
        
        // Mostrar mensaje de éxito
        alert('Producto eliminado correctamente');
        
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert(`Error: ${err.message}`);
      }
    }
  }, [apiUrl]);
  
  const columns = useMemo(
    () => [
      { 
        Header: 'ID', 
        accessor: 'id_producto',
        Cell: ({ value }) => <span style={{ fontWeight: 'bold' }}>{value}</span>
      },
      { 
        Header: 'Código de Barras', 
        accessor: 'codigo_barras',
      },
      { Header: 'Nombre', accessor: 'nombre_producto' },
      { Header: 'Descripción', accessor: 'descripcion' },
      {
        Header: 'P. Compra',
        accessor: 'precio_compra',
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`
      },
      {
        Header: 'P. Venta',
        accessor: 'precio_venta',
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`
      },
      {
        Header: 'Margen',
        accessor: 'margen_ganancia',
        Cell: ({ value, row }) => {
          // Si tenemos el margen, lo mostramos, sino lo calculamos
          if (value) return `${parseFloat(value).toFixed(2)}%`;
          const compra = row.original.precio_compra;
          const venta = row.original.precio_venta;
          if (!compra || !venta) return '0.00%';
          const margen = ((venta - compra) / compra) * 100;
          return `${margen.toFixed(2)}%`;
        }
      },
      {
        Header: 'Categoría',
        accessor: 'id_categoria',
        Cell: ({ value }) => {
          const categoria = categorias.find(cat => cat.id_categoria === value);
          return categoria ? categoria.nombre_categoria : value;
        }
      },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="btn-edit"
              onClick={() => {
                setFormData({
                  id_producto: row.original.id_producto,
                  id_categoria: row.original.id_categoria,
                  codigo_barras: row.original.codigo_barras,
                  nombre_producto: row.original.nombre_producto,
                  descripcion: row.original.descripcion,
                  precio_compra: row.original.precio_compra,
                  precio_venta: row.original.precio_venta
                });
                setIsEditing(true);
                setCurrentView('form');
              }}
            >
              Editar
            </button>
            
            {/* Reemplaza este botón */}
            <button
              className="btn-delete"
              onClick={() => handleDelete(row.original.id_producto, row.original.nombre_producto)}
            >
              Eliminar
            </button>
          </div>
        ),
        disableSortBy: true
      }
    ],
    [categorias, handleDelete]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useSortBy,
    usePagination
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('precio') ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      let response;
      
      if (isEditing) {
        // Actualizar producto existente
        response = await fetch(`${apiUrl}/api/productos/productos/${formData.id_producto}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_categoria: formData.id_categoria,
            codigo_barras: formData.codigo_barras,
            nombre_producto: formData.nombre_producto,
            descripcion: formData.descripcion,
            precio_compra: formData.precio_compra,
            precio_venta: formData.precio_venta
          }),
        });
      } else {
        // Crear nuevo producto
        response = await fetch(`${apiUrl}/api/productos/productos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_categoria: formData.id_categoria,
            codigo_barras: formData.codigo_barras,
            nombre_producto: formData.nombre_producto,
            descripcion: formData.descripcion,
            precio_compra: formData.precio_compra,
            precio_venta: formData.precio_venta
          }),
        });
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error al ${isEditing ? 'actualizar' : 'guardar'} el producto`);
      }
      
      // Mostrar mensaje de éxito
      setFormSuccess(`Producto ${isEditing ? 'actualizado' : 'guardado'} exitosamente`);
      
      // Recargar productos
      const productosResponse = await fetch(`${apiUrl}/api/productos/productos`);
      const productosData = await productosResponse.json();
      setProductos(productosData.filter(producto => producto.activo));
      
      // Reset form y volver a la lista
      setTimeout(() => {
        setCurrentView('list');
        setIsEditing(false);
        setFormData({
          id_categoria: '',
          codigo_barras: '',
          nombre_producto: '',
          descripcion: '',
          precio_compra: 0,
          precio_venta: 0
        });
        setFormSuccess('');
      }, 1500);
      
    } catch (err) {
      setFormError(err.message);
      console.error('Error al guardar:', err);
    }
  };

  const cancelForm = () => {
    setCurrentView('list');
    setIsEditing(false);
    setFormData({
      id_categoria: '',
      codigo_barras: '',
      nombre_producto: '',
      descripcion: '',
      precio_compra: 0,
      precio_venta: 0
    });
    setFormError('');
    setFormSuccess('');
  };

  if (loading) return (
    <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
      <div className="spinner"></div>
      <p>Cargando productos...</p>
    </div>
  );

  if (error) return (
    <div className="error-container" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        style={{ padding: '8px 16px', marginTop: '10px' }}
      >
        Reintentar
      </button>
    </div>
  );

  const renderList = () => (
    <div className="card compact-card" style={{ 
      background: 'transparent',
      borderCollapse: 'collapse',
      width: '100%'
    }}>
      <div className="table-header">
        <div className="table-controls">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID..."
            className="search-input"
          />
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="page-size-select"
          >
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>Mostrar {size}</option>
            ))}
          </select>
        </div>
        <button
          className="btn-add"
          onClick={() => {
            setCurrentView('form');
            setIsEditing(false);
          }}
        >
          + Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="no-data-message" style={{ textAlign: 'center', padding: '30px' }}>
          No hay productos activos para mostrar.
        </div>
      ) : (
        <>
          <table {...getTableProps()} className="sales-table compact-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc ? ' ▼' : ' ▲'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination compact-pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>{' '}
            <span>Página <strong>{pageIndex + 1} de {pageOptions.length}</strong></span>
          </div>
        </>
      )}
    </div>
  );

  const renderForm = () => (
    <div className="card compact-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.11)' }}>
      <h3 className="compact-title">
        {isEditing ? 'Editar Producto' : 'Registrar Producto'}
      </h3>
      
      {formError && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: '4px' }}>
          {formError}
        </div>
      )}
      
      {formSuccess && (
        <div className="success-message" style={{ color: 'green', margin: '10px 0', padding: '10px', backgroundColor: 'rgba(0, 128, 0, 0.1)', borderRadius: '4px' }}>
          {formSuccess}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        {isEditing && (
          <div className="form-group compact-form-group">
            <label>ID:</label>
            <input
              type="text"
              name="id_producto"
              value={formData.id_producto}
              disabled
              className="form-input compact-input"
            />
          </div>
        )}
        
        <div className="form-group compact-form-group">
          <label>Categoría (ID):</label>
          <select
            name="id_categoria"
            value={formData.id_categoria}
            onChange={handleInputChange}
            required
            className="form-input compact-input"
          >
            <option value="">-- Seleccionar ID Categoría --</option>
            {categorias && categorias.length > 0 ? (
              categorias.map(categoria => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.id_categoria}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay categorías disponibles</option>
            )}
          </select>
        </div>
        
        <div className="form-group compact-form-group">
          <label>Código de Barras:</label>
          <input
            type="text"
            name="codigo_barras"
            value={formData.codigo_barras}
            onChange={handleInputChange}
            required
            className="form-input compact-input"
          />
        </div>
        
        <div className="form-group compact-form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={handleInputChange}
            required
            className="form-input compact-input"
          />
        </div>
        
        <div className="form-group compact-form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="form-textarea compact-textarea"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group compact-form-group">
            <label>Precio Compra:</label>
            <input
              type="number"
              name="precio_compra"
              value={formData.precio_compra}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="form-input compact-input"
            />
          </div>
          
          <div className="form-group compact-form-group">
            <label>Precio Venta:</label>
            <input
              type="number"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="form-input compact-input"
            />
          </div>
        </div>
        
        <div className="modal-actions compact-actions">
          <button 
            type="button"
            className="btn-cancel"
            onClick={cancelForm}
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="btn-submit"
          >
            {isEditing ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="sales-history-container compact-container">
      {currentView === 'list' && renderList()}
      {currentView === 'form' && renderForm()}
    </div>
  );
};

export default ProductList;