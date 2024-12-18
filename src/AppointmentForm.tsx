import React, { useState } from 'react';
import axios from 'axios';
import { Appointment } from './types'; // Necesitarás definir este tipo

const AppointmentForm: React.FC<{ 
  onAddAppointment: (appointment: Appointment) => void;
  onCancel: () => void;
}> = ({ onAddAppointment, onCancel }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [service, setService] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppointment: Appointment = {
      customerName,
      customerPhone,
      appointmentDate,
      appointmentTime,
      service,
      status: 'Programada'
    };

    try {
      const response = await axios.post('https://app-ordenes-backend.onrender.com/api/appointments', newAppointment);
      onAddAppointment(response.data);
      // Resetear el formulario
      setCustomerName('');
      setCustomerPhone('');
      setAppointmentDate('');
      setAppointmentTime('');
      setService('');
      setError('');
    } catch (error) {
      console.error('Error al agendar cita:', error);
      setError('No se pudo agendar la cita. Intente nuevamente.');
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Agendar Nueva Cita</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono del Cliente"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="input-field"
          maxLength={10}
          required
        />
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Servicio"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="input-field"
          required
        />
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Agendar Cita</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;