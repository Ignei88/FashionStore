import React, { useState, useEffect } from 'react';
import '../styles/SalesRegister.css';

const SalesRegister = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [cart, setCart] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metodosPago, setMetodosPago] = useState([]);
  const [selectedMetodoPago, setSelectedMetodoPago] = useState('');
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Cargar métodos de pago
  useEffect(() => {
    const fetchMetodosPago = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/ventas/metodos_pago`);
        if (!response.ok) {
          throw new Error('Error al obtener métodos de pago');
        }
        const data = await response.json();
        setMetodosPago(data);
        // Seleccionar el primer método por defecto si hay alguno
        if (data.length > 0) {
          setSelectedMetodoPago(data[0].id_metodo_pago);
        }
      } catch (err) {
        console.error('Error al cargar métodos de pago:', err);
        // Usar algunos métodos de pago por defecto en caso de error
        setMetodosPago([
          { id_metodo_pago: 1, nombre_metodo: 'Efectivo' },
          { id_metodo_pago: 2, nombre_metodo: 'Tarjeta' }
        ]);
        setSelectedMetodoPago(1);
      }
    };

    fetchMetodosPago();
  }, [apiUrl]);

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/ventas/clientes`);
        if (!response.ok) {
          throw new Error('Error al obtener clientes');
        }
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      }
    };

    fetchClientes();
  }, [apiUrl]);

  // Función para buscar producto por ID
  const searchProduct = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('Buscando producto con ID:', productId);
      
      // Usar la API que sí funciona y filtrar en el cliente
      const response = await fetch(`${apiUrl}/api/productos/productos`);
      
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      
      const allProducts = await response.json();
      console.log('Productos obtenidos:', allProducts.length);
      
      // Filtrar por ID
      // eslint-disable-next-line eqeqeq
      const productFound = allProducts.find(p => p.id_producto == productId);
      
      if (!productFound) {
        throw new Error('Producto no encontrado');
      }
      
      console.log('Producto encontrado:', productFound);
      
      // Agregar al carrito
      const productoParaCarrito = {
        id_producto: productFound.id_producto,
        nombre_producto: productFound.nombre_producto,
        precio_venta: productFound.precio_venta,
        cantidad: quantity
      };
      
      addProductToCart(productoParaCarrito);
      
    } catch (err) {
      setErrorMessage(err.message);
      console.error('Error al buscar producto:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para agregar producto al carrito
  const addProductToCart = (productToAdd) => {
    console.log('Agregando al carrito:', productToAdd);
    
    const existingItemIndex = cart.findIndex(item => item.id_producto === productToAdd.id_producto);
    
    if (existingItemIndex >= 0) {
      // Si el producto ya está en el carrito, actualizar cantidad
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].cantidad += productToAdd.cantidad;
      setCart(updatedCart);
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      setCart([...cart, productToAdd]);
    }
    
    // Limpiar el campo de ID y resetear cantidad
    setProductId('');
    setQuantity(1);
  };

  // Función para manejar tecla Enter en la búsqueda
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchProduct();
    }
  };

  // Función para actualizar cantidad en el carrito
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].cantidad = newQuantity;
    setCart(updatedCart);
  };

  // Función para eliminar del carrito
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Cálculo del total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const precio = parseFloat(item.precio_venta) || 0;
      const cantidad = parseInt(item.cantidad) || 0;
      return total + (precio * cantidad);
    }, 0);
  };

  // Función para manejar el pago
  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  // Función para procesar el pago
  const handleModalPayment = async () => {
    if (!selectedMetodoPago) {
      setErrorMessage('Por favor seleccione un método de pago');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const total = calculateTotal();
      
      // Preparar los datos para la API
      const ventaData = {
        id_cliente: selectedCliente ? parseInt(selectedCliente) : null,
        id_usuario: 57, // Sustituir por el ID real del usuario logueado
        id_metodo_pago: parseInt(selectedMetodoPago), // ID del método seleccionado
        subtotal: total,
        impuestos: 0.00,
        descuento: 0.00,
        total: total,
        productos: cart.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_venta: item.precio_venta
        }))
      };
      
      const response = await fetch(`${apiUrl}/api/ventas/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar la venta');
      }
      
      const result = await response.json();
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`Venta #${result.id} registrada correctamente`);
      
      // Limpiar carrito y cerrar modal
      setCart([]);
      setShowPaymentModal(false);
      setAmountReceived('');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setErrorMessage(err.message);
      console.error('Error al procesar pago:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const change = amountReceived ? (parseFloat(amountReceived) - calculateTotal()) : 0;

  return (
    <div>
      {errorMessage && (
        <div className="error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message" style={{ color: 'green', padding: '10px', marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}
      
      <div className="product-search-container">
        <input
          type="text"
          placeholder="ID del producto"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <div className="quantity-selector">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isLoading}
          >-</button>
          <input 
            type="number" 
            value={quantity} 
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            disabled={isLoading}
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            disabled={isLoading}
          >+</button>
        </div>
        
        <button 
          className="add-product-btn" 
          onClick={searchProduct}
          disabled={isLoading || !productId}
        >
          {isLoading ? 'Buscando...' : 'Agregar'}
        </button>
      </div>
      
      <table className="products-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.id_producto}</td>
              <td>{item.nombre_producto}</td>
              <td>
                <div className="quantity-actions">
                  <button onClick={() => updateQuantity(index, item.cantidad - 1)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => updateQuantity(index, item.cantidad + 1)}>+</button>
                </div>
              </td>
              <td>${parseFloat(item.precio_venta).toFixed(2)}</td>
              <td>${(parseFloat(item.precio_venta) * item.cantidad).toFixed(2)}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => removeFromCart(index)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {cart.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No hay productos agregados
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="total-container">
        Total a pagar: ${calculateTotal().toFixed(2)}
      </div>
      
      <div className="payment-buttons">
        <button 
          className="cancel-btn payment-btn"
          onClick={() => setCart([])}
          disabled={cart.length === 0 || isLoading}
        >
          Cancelar
        </button>
        <button 
          className="pay-btn payment-btn"
          onClick={handlePayment}
          disabled={cart.length === 0 || isLoading}
        >
          Pagar
        </button>
      </div>
      
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color:"#ffff" }}>Pagar venta</h3>
            
            {/* Selector de cliente */}
            <div className="modal-row">
              <label htmlFor="cliente" style={{ color:"#ffff" }}>Cliente:</label>
              <select
                id="cliente"
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                className="payment-method-select"
                
                disabled={isLoading}
              >
                <option value="">-- Sin cliente --</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.id_cliente} - {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="modal-row">
              <span style={{ color:"#ffff" }}>Total a pagar:</span>
              <span style={{ color:"#ffff" }}>${calculateTotal().toFixed(2)}</span>
            </div>
            
            {/* Selector de método de pago */}
            <div className="modal-row">
              <label htmlFor="metodoPago" style={{ color:"#ffff" }}>Método de pago:</label>
              <select
                id="metodoPago"
                value={selectedMetodoPago}
                onChange={(e) => setSelectedMetodoPago(e.target.value)}
                className="payment-method-select"
                disabled={isLoading}
              >
                <option value="">-- Seleccionar método --</option>
                {metodosPago.map(metodo => (
                  <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
                    {metodo.nombre_metodo}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="modal-row">
              <label htmlFor="amountReceived" style={{ color:"#ffff" }}>Cantidad recibida:</label>
              <input
                id="amountReceived"
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                min={calculateTotal()}
                step="0.01"
                disabled={isLoading}
              />
            </div>
            
            <div className="modal-row">
              <span style={{ color:"#ffff" }}>Cambio:</span>
              <span style={{ color:"#ffff" }}>${change.toFixed(2)}</span>
            </div>
            
            <div className="modal-buttons">
              <button 
                className="modal-back-btn modal-btn"
                onClick={() => setShowPaymentModal(false)}
                disabled={isLoading}
              >
                Volver
              </button>
              <button 
                className="modal-cancel-btn modal-btn"
                onClick={() => {
                  setShowPaymentModal(false);
                  setCart([]);
                }}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                className="modal-pay-btn modal-btn"
                onClick={handleModalPayment}
                disabled={change < 0 || isLoading || !selectedMetodoPago}
              >
                {isLoading ? 'Procesando...' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesRegister;