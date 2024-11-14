import React, { useState, useEffect } from 'react';
import Inicio from './Inicio';
import Login from './Login';
import OrdersForm from './OrdersForm';
import OrderStatus from './OrderStatus';
import './styles/global.css';
import axios from 'axios';
import { Order } from './types';

// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
console.log('API URL:', import.meta.env.VITE_API_URL);
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [viewOrderStatus, setViewOrderStatus] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleLoginClick = () => setShowLogin(true);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleAddOrder = (order: Order) => {
    setOrders([...orders, order]);
    setFilteredOrders([...orders, order]);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/orders/${updatedOrder._id}`,
        updatedOrder
      );
      const updatedOrders = orders.map(order =>
        order._id === updatedOrder._id ? response.data : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      try {
        await axios.delete(`${API_URL}/api/orders/${orderId}`);
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleSearch = (searchResults: Order[]) => {
    setFilteredOrders(searchResults);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  return (
    <div className="app-container">
      {viewOrderStatus ? (
        <OrderStatus />
      ) : !isLoggedIn && !showLogin ? (
        <Inicio 
          onLoginClick={handleLoginClick} 
          onSearchClick={() => setViewOrderStatus(true)}
        />
      ) : showLogin && !isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : isLoggedIn ? (
        <>
          <OrdersForm 
            onAddOrder={handleAddOrder} 
            editingOrder={editingOrder}
            onUpdateOrder={handleUpdateOrder}
            orders={orders}
            onSearch={handleSearch}
          />
          <div className="orders-list">
            <h2>Órdenes</h2>
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <h3>Orden #{order._id}</h3>
                  <p><strong>Marca:</strong> {order.brand}</p>
                  <p><strong>Modelo:</strong> {order.model}</p>
                  <p><strong>Tipo:</strong> {order.repairType}</p>
                  <p><strong>Costo:</strong> ${order.cost}</p>
                  <p><strong>Cliente:</strong> {order.customerName}</p>
                  <p><strong>Estado:</strong> {order.status}</p>
                  <div className="order-actions">
                    <button 
                      onClick={() => setEditingOrder(order)}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order._id!)}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default App;