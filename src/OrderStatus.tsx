import React, { useState } from 'react';
import { Order } from './types';

const OrderStatus: React.FC = () => {
  // Estados para el número de orden, los datos de la orden y cualquier error
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar la búsqueda de la orden
  const handleOrderSearch = async () => {
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`https://app-ordenes-backend.onrender.com/api/orders/${orderNumber}`);

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError('Orden no encontrada');
      }
    } catch {
      setError('Error al buscar la orden');
    }
  };

  return (
    <div className="order-status-container">
      <h2>Buscar Estado de Orden</h2>

      {/* Contenedor de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Número de Orden"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <button onClick={handleOrderSearch}>Buscar</button>
      </div>

      {/* Mensaje de error */}
      {error && <p className="error">{error}</p>}

      {/* Detalles de la orden si existe */}
      {order && (
        <div className="order-details">
          <h3>Detalles de la Orden</h3>
          <p><strong>Marca:</strong> {order.brand}</p>
          <p><strong>Modelo:</strong> {order.model}</p>
          <p><strong>Tipo de Reparación:</strong> {order.repairType}</p>
          <p><strong>Costo:</strong> ${order.cost}</p>
          <p><strong>Nombre del Cliente:</strong> {order.customerName}</p>
          <p><strong>Teléfono del Cliente:</strong> {order.customerPhone}</p>
          <p><strong>Dirección del Cliente:</strong> {order.customerAddress}</p>
          <p><strong>Estado:</strong> {order.status}</p>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;