import React, { useState, useMemo, useEffect } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import "../styles/General.css";

const StaffList = () => {
  /*
  const data = useMemo(
    () => [
      {
        id: 1,
        nombreCompleto: 'Juan Pérez López',
        edad: 28,
        genero: 'Masculino',
        correo: 'juan.perez@example.com',
        telefono: '5551234567',
        sueldo: 12000,
        usuario: 'juanperez',
        rol: 'Administrador'
      },
      {
        id: 2,
        nombreCompleto: 'María García Sánchez',
        edad: 32,
        genero: 'Femenino',
        correo: 'maria.garcia@example.com',
        telefono: '5557654321',
        sueldo: 10000,
        usuario: 'mariagarcia',
        rol: 'Empleado'
      },
      {
        id: 3,
        nombreCompleto: 'Carlos Martínez Ruiz',
        edad: 25,
        genero: 'Masculino',
        correo: 'carlos.martinez@example.com',
        telefono: '5559876543',
        sueldo: 9500,
        usuario: 'carlosmartinez',
        rol: 'Empleado'
      }
    ],
    []
  );
  */
  const [empleados, setEmpleados] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    edad: "",
    genero: "Masculino",
    correo: "",
    telefono: "",
    sueldo: "",
    usuario: "",
    contrasena: "",
    rol: "Empleado",
  });

useEffect(() => {
  const fetchStaffData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users/users`);
      if (!response.ok) throw new Error("Error al obtener los empleados");
      const result = await response.json();

      if (!Array.isArray(result)) {
        throw new Error("La respuesta del servidor no es un arreglo.");
      }

      const empleadosFormateados = result.map((empleado) => ({
        id: empleado.id_usuario,
        nombreCompleto: `${empleado.nombre} ${empleado.apellido}`,
        edad: empleado.edad || "No especificada",
        genero: empleado.generi || "No especificado",
        correo: empleado.email,
        telefono: empleado.telefono || "No registrado",
        sueldo: empleado.sueldo || 'No registrado',
        usuario: empleado.email.split("@")[0], 
        rol: empleado.id_rol === 1 ? "Administrador" : "Empleado"
      }));

      setEmpleados(empleadosFormateados); 
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setEmpleados([]);
    }
  };

  fetchStaffData();
}, [apiUrl]);



  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
      },
      { Header: "Nombre Completo", accessor: "nombreCompleto" },
      { Header: "Edad", accessor: "edad" },
      { Header: "Género", accessor: "genero" },
      { Header: "Correo Electrónico", accessor: "correo" },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="btn-details"
              onClick={() => {
                setEmpleadoSeleccionado(row.original);
                setCurrentView("details");
              }}
            >
              <i className="fas fa-eye">Ver mas detalles</i>
            </button>
            <button
              className="btn-edit"
              onClick={() => {
                setEmpleadoSeleccionado(row.original);
                setFormData(row.original);
                setIsEditing(true);
                setCurrentView("form");
              }}
            >
              <i className="fas fa-edit">Editar</i>
            </button>
            <button
              className="btn-delete"
              onClick={() => {
                if (
                  window.confirm(`¿Eliminar a ${row.original.nombreCompleto}?`)
                ) {
                  // Lógica para eliminar
                }
              }}
            >
              <i className="fas fa-trash">Eliminar</i>
            </button>
          </div>
        ),
        disableSortBy: true,
      },
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
      data: empleados,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar/actualizar empleado
    setCurrentView("list");
    setIsEditing(false);
    setFormData({
      nombreCompleto: "",
      edad: "",
      genero: "Masculino",
      correo: "",
      telefono: "",
      sueldo: "",
      usuario: "",
      contrasena: "",
      rol: "Empleado",
    });
  };

  const cancelForm = () => {
    setCurrentView("list");
    setIsEditing(false);
    setFormData({
      nombreCompleto: "",
      edad: "",
      genero: "Masculino",
      correo: "",
      telefono: "",
      sueldo: "",
      usuario: "",
      contrasena: "",
      rol: "Empleado",
    });
  };

  const renderList = () => (
    <div
      className="card compact-card"
      style={{
        background: "transparent",
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <div className="table-header">
        <div className="table-controls">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar empleados..."
            className="search-input"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="page-size-select"
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn-add"
          onClick={() => {
            setCurrentView("form");
            setIsEditing(false);
          }}
        >
          <i className="fas fa-plus"></i> + Registrar nuevo empleado
        </button>
      </div>

      <table {...getTableProps()} className="sales-table compact-table">
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...headerGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...columnProps } =
                    column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th key={columnKey} {...columnProps}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ▼"
                            : " ▲"
                          : ""}
                      </span>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <tr key={rowKey} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={cellKey} {...cellProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination compact-pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Página{" "}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>
        </span>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div
      className="card compact-card"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.11)" }}
    >
      <h3 className="compact-title">Detalles del empleado</h3>
      <div className="sale-info compact-info">
        <p>
          <strong>Nombre completo:</strong>{" "}
          {empleadoSeleccionado.nombreCompleto}
        </p>
        <p>
          <strong>Edad:</strong> {empleadoSeleccionado.edad}
        </p>
        <p>
          <strong>Género:</strong> {empleadoSeleccionado.genero}
        </p>
        <p>
          <strong>Correo electrónico:</strong> {empleadoSeleccionado.correo}
        </p>
        <p>
          <strong>Teléfono:</strong> {empleadoSeleccionado.telefono}
        </p>
        <p>
          <strong>Sueldo:</strong> ${empleadoSeleccionado.sueldo}
        </p>
        <p>
          <strong>Usuario:</strong> {empleadoSeleccionado.usuario}
        </p>
        <p>
          <strong>Rol:</strong> {empleadoSeleccionado.rol}
        </p>
      </div>

      <div className="modal-actions compact-actions">
        <button className="btn-cancel" onClick={() => setCurrentView("list")}>
          Volver
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div
      className="card compact-card"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.11)" }}
    >
      <h3 className="compact-title">
        {isEditing ? "Editar empleado" : "Registrar nuevo empleado"}
      </h3>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group compact-form-group">
          <label>Nombre completo:</label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
            required
            className="form-input compact-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group compact-form-group">
            <label>Edad:</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              min="18"
              max="70"
              required
              className="form-input compact-input"
            />
          </div>

          <div className="form-group compact-form-group">
            <label>Género:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="genero"
                  value="Masculino"
                  checked={formData.genero === "Masculino"}
                  onChange={handleInputChange}
                />{" "}
                Masculino
              </label>
              <label>
                <input
                  type="radio"
                  name="genero"
                  value="Femenino"
                  checked={formData.genero === "Femenino"}
                  onChange={handleInputChange}
                />{" "}
                Femenino
              </label>
              <label>
                <input
                  type="radio"
                  name="genero"
                  value="Otro"
                  checked={formData.genero === "Otro"}
                  onChange={handleInputChange}
                />{" "}
                Otro
              </label>
            </div>
          </div>
        </div>

        <div className="form-group compact-form-group">
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
            className="form-input compact-input"
          />
        </div>

        <div className="form-group compact-form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
            className="form-input compact-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group compact-form-group">
            <label>Sueldo:</label>
            <input
              type="number"
              name="sueldo"
              value={formData.sueldo}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="form-input compact-input"
            />
          </div>

          <div className="form-group compact-form-group">
            <label>Rol:</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              className="form-input compact-input"
            >
              <option value="Empleado">Empleado</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group compact-form-group">
            <label>Usuario:</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              required
              className="form-input compact-input"
            />
          </div>

          <div className="form-group compact-form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              required={!isEditing}
              className="form-input compact-input"
            />
          </div>
        </div>

        <div className="modal-actions compact-actions">
          <button type="button" className="btn-cancel" onClick={cancelForm}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            {isEditing ? "Actualizar" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="sales-history-container compact-container">
      {currentView === "list" && renderList()}
      {currentView === "details" && renderDetails()}
      {currentView === "form" && renderForm()}
    </div>
  );
};

export default StaffList;
