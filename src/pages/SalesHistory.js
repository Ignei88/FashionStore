import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import '../styles/General.css';

const SalesHistory = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Cargar datos de ventas
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/ventas/ventas`);
        if (!response.ok) {
          throw new Error('Error al obtener ventas');
        }
        const data = await response.json();
        setVentas(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar ventas:', err);
        setError('Error al cargar ventas: ' + err.message);
        setLoading(false);
      }
    };

    fetchVentas();
  }, [apiUrl]);

  // Formatear fecha y hora
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Preparar datos para la tabla
  const data = useMemo(() => ventas, [ventas]);

  // Definir columnas principales para la lista - mostrar solo los campos necesarios
  const columns = useMemo(
    () => [
      { 
        Header: 'ID',
        accessor: 'id_venta',
        Cell: ({ value }) => <span style={{ fontWeight: 'bold' }}>{value}</span>
      },
      { 
        Header: 'Fecha y Hora', 
        accessor: 'fecha_venta',
        Cell: ({ value }) => <span style={{ whiteSpace: 'nowrap' }}>{formatDateTime(value)}</span>
      },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`
      },
      {
        Header: 'Estado',
        accessor: 'estado',
        Cell: ({ value }) => (
          <span className={`status-badge ${value?.toLowerCase()}`}>
            {value}
          </span>
        )
      },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <button
            className="btn-details"
            onClick={() => {
              setVentaSeleccionada(row.original);
              setCurrentView('details');
            }}
          >
            Ver detalles
          </button>
        ),
        disableSortBy: true
      }
    ],
    []
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
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const renderList = () => (
    <div className="card compact-card" style={{ 
      background: 'transparent',
      borderCollapse: 'collapse',
      width: '100%'
    }}>
      <div className="table-controls">
        <input
          type="text"
          value={globalFilter || ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Buscar por ID, estado, etc..."
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

      {loading ? (
        <div className="loading-message">Cargando ventas...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : ventas.length === 0 ? (
        <div className="no-data-message">No hay ventas registradas</div>
      ) : (
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
      )}

      <div className="pagination compact-pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>{' '}
        <span>Página <strong>{pageIndex + 1} de {pageOptions.length}</strong></span>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="card compact-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.11)' }}>
      <h3 className="compact-title">Detalles de Venta</h3>
      
      {loading ? (
        <div className="loading-message">Cargando detalles...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="sale-info compact-info">
          <p><strong>ID de Venta:</strong> {ventaSeleccionada.id_venta}</p>
          <p><strong>Fecha y Hora:</strong> {formatDateTime(ventaSeleccionada.fecha_venta)}</p>
          <p><strong>ID de Cliente:</strong> {ventaSeleccionada.id_cliente || 'N/A'}</p>
          <p><strong>ID de Usuario:</strong> {ventaSeleccionada.id_usuario || 'N/A'}</p>
          <p><strong>ID de Método de Pago:</strong> {ventaSeleccionada.id_metodo_pago || 'N/A'}</p>
          <p><strong>Subtotal:</strong> ${parseFloat(ventaSeleccionada.subtotal).toFixed(2)}</p>
          <p><strong>Impuestos:</strong> ${parseFloat(ventaSeleccionada.impuestos).toFixed(2)}</p>
          <p><strong>Descuento:</strong> ${parseFloat(ventaSeleccionada.descuento).toFixed(2)}</p>
          <p><strong>Total:</strong> ${parseFloat(ventaSeleccionada.total).toFixed(2)}</p>
          <p><strong>Estado:</strong> {ventaSeleccionada.estado}</p>
        </div>
      )}

      <div className="modal-actions compact-actions">
        <button 
          className="btn-cancel"
          onClick={() => setCurrentView('list')}
        >
          Volver al historial
        </button>
      </div>
    </div>
  );

  return (
    <div className="sales-history-container compact-container">
      {currentView === 'list' && renderList()}
      {currentView === 'details' && renderDetails()}
    </div>
  );
};

export default SalesHistory;