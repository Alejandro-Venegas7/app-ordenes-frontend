import React, { useState, useEffect } from 'react';
import Inicio from './Inicio';
import Login from './Login';
import OrdersForm from './OrdersForm';
import OrderStatus from './OrderStatus';
import './styles/global.css';
import axios from 'axios';
import { Order } from './types';

const App: React.FC = () => {
  // Estado de la aplicación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [viewOrderStatus, setViewOrderStatus] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Funciones para manejar eventos de login
  const handleLoginClick = () => setShowLogin(true);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  // Funciones para manejar las órdenes
  const handleAddOrder = (order: Order) => {
    setOrders([...orders, order]);
    setFilteredOrders([...orders, order]);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/orders/${updatedOrder._id}`,
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
        await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
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

  // Función para obtener las órdenes desde la API
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Efecto para obtener las órdenes cuando el usuario está logueado
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  // Renderizado de la UI
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