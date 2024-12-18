import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Appointment {
  _id: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: string;
}

const AppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('https://app-ordenes-backend.onrender.com/api/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lista de Citas</h2>
      {loading ? (
        <p>Cargando citas...</p>
      ) : appointments.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {appointments.map((appointment) => (
            <li key={appointment._id} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <p><strong>Cliente:</strong> {appointment.customerName}</p>
              <p><strong>Teléfono:</strong> {appointment.customerPhone}</p>
              <p><strong>Fecha:</strong> {appointment.appointmentDate}</p>
              <p><strong>Hora:</strong> {appointment.appointmentTime}</p>
              <p><strong>Servicio:</strong> {appointment.service}</p>
              <p><strong>Estatus:</strong> {appointment.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsList;
