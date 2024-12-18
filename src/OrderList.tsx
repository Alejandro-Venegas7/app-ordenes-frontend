import React from 'react';
import { jsPDF } from "jspdf";

// Define el tipo de las órdenes para que TypeScript lo reconozca
interface Order {
  _id: string;
  marca: string;
  modelo: string;
  tipoReparacion: string;
  costo: number;
  nombreCliente: string;
  telefonoCliente: string;
  direccionCliente: string;
}

// Componente de la lista de órdenes con la opción de exportar a PDF
const OrderList: React.FC<{ orders: Order[] }> = ({ orders }) => {
  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Configuración de la fuente y tamaño
    doc.setFont('helvetica');
    doc.setFontSize(12);  // Aseguramos que la fuente sea suficientemente pequeña para evitar empalmes

    // Márgenes y espaciado
    const marginLeft = 20;
    const marginTop = 20;
    const lineHeight = 8;  // Altura de la línea, ajustamos para mayor espacio
    const cardHeight = 80;  // Ajusta la altura de cada card (orden)
    const cardMarginBottom = 15;  // Espaciado entre cards

    // Agregamos un título
    doc.text("Listado de Órdenes", marginLeft, marginTop);

    // Recorremos las órdenes y las añadimos al PDF
    orders.forEach((order, index) => {
      const yPosition = marginTop + (index * (cardHeight + cardMarginBottom));  // Ajuste el espaciado entre órdenes

      // Añadimos el contenido dentro de cada "card"
      doc.text(`Orden #${order._id}`, marginLeft, yPosition + lineHeight);
      doc.text(`Marca: ${order.marca}`, marginLeft, yPosition + lineHeight * 2);
      doc.text(`Modelo: ${order.modelo}`, marginLeft, yPosition + lineHeight * 3);
      doc.text(`Tipo de Reparación: ${order.tipoReparacion}`, marginLeft, yPosition + lineHeight * 4);
      doc.text(`Costo: $${order.costo}`, marginLeft, yPosition + lineHeight * 5);
      doc.text(`Nombre del Cliente: ${order.nombreCliente}`, marginLeft, yPosition + lineHeight * 6);
      doc.text(`Teléfono del Cliente: ${order.telefonoCliente}`, marginLeft, yPosition + lineHeight * 7);
      doc.text(`Dirección del Cliente: ${order.direccionCliente}`, marginLeft, yPosition + lineHeight * 8);
    });

    // Descargar el archivo PDF
    doc.save("ordenes.pdf");
  };

  return (
    <div>
      <button onClick={exportToPDF}>Exportar a PDF</button>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            {order.marca} - {order.modelo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;