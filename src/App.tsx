import React, { useState, useEffect } from 'react';
import Inicio from './Inicio';
import Login from './Login';
import OrdersForm from './OrdersForm';
import OrderStatus from './OrderStatus';
import AppointmentForm from './AppointmentForm';
import './styles/global.css';
import axios from 'axios';
import { Order, Appointment } from './types';
import { jsPDF } from 'jspdf';

// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
console.log('API URL:', import.meta.env.VITE_API_URL);

axios.defaults.baseURL = API_URL;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [viewOrderStatus, setViewOrderStatus] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
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

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    setShowAppointmentForm(false);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const response = await axios.put(`/api/orders/${updatedOrder._id}`, updatedOrder);
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
        await axios.delete(`/api/orders/${orderId}`);
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

  const handleAppointmentSearch = (searchResults: Appointment[]) => {
    setFilteredAppointments(searchResults);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      fetchAppointments();
    }
  }, [isLoggedIn]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Órdenes", 20, 20);

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

    doc.save("ordenes.pdf");
  };

  return (
    <div className="app-container">
      {viewOrderStatus ? (
        <OrderStatus />
      ) : !isLoggedIn && !showLogin && !showAppointmentForm ? (
        <Inicio 
          onLoginClick={handleLoginClick} 
          onSearchClick={() => setViewOrderStatus(true)}
          onScheduleAppointmentClick={() => setShowAppointmentForm(true)}
        />
      ) : showLogin && !isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : showAppointmentForm ? (
        <AppointmentForm 
          onAddAppointment={handleAddAppointment}
          onCancel={() => setShowAppointmentForm(false)}
        />
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
            
            <div className="appointments-section">
              <h3>Citas Programadas</h3>
              <input 
                type="text" 
                placeholder="Buscar cita..." 
                onChange={(e) => handleAppointmentSearch(appointments.filter((appointment) => 
                  appointment.customerName.toLowerCase().includes(e.target.value.toLowerCase()) || 
                  appointment.service.toLowerCase().includes(e.target.value.toLowerCase())
                ))}
                style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
              />
              <div className="appointments-grid">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <p><strong>Cliente:</strong> {appointment.customerName}</p>
                    <p><strong>Servicio:</strong> {appointment.service}</p>
                    <p><strong>Fecha:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Hora:</strong> {appointment.appointmentTime}</p>
                    <p><strong>Estado:</strong> {appointment.status}</p>
                  </div>
                ))}
              </div>
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
