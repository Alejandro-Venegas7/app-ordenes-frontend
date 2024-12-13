import React, { useState, useEffect } from 'react';
import Inicio from './Inicio';
import Login from './Login';
import OrdersForm from './OrdersForm';
import OrderStatus from './OrderStatus';
import './styles/global.css';
import axios from 'axios';
import { Order } from './types';
import { jsPDF } from 'jspdf';

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

  // Función para exportar las órdenes a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.text("Listado de Órdenes", 20, 20);

    // Añadir las órdenes al PDF
    filteredOrders.forEach((order, index) => {
      const yPosition = 30 + index * 40;
      doc.text(`Orden #${order._id}`, 20, yPosition);
      doc.text(`Marca: ${order.brand}`, 20, yPosition + 10);
      doc.text(`Modelo: ${order.model}`, 20, yPosition + 20);
      doc.text(`Tipo de Reparación: ${order.repairType}`, 20, yPosition + 30);
      doc.text(`Costo: $${order.cost}`, 20, yPosition + 40);
      doc.text(`Cliente: ${order.customerName}`, 20, yPosition + 50);
      doc.text(`Teléfono: ${order.customerPhone}`, 20, yPosition + 60);
      doc.text(`Dirección: ${order.customerAddress}`, 20, yPosition + 70);
    });

    // Descargar el archivo PDF
    doc.save("ordenes.pdf");
  };

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
            <div className="orders-actions">
              <button onClick={exportToPDF} className="export-pdf-button">
                Exportar a PDF
              </button>
            </div>
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
