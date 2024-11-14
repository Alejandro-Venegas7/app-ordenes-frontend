import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/global.css';
import { Order, OrderStatus } from './types';

interface OrdersFormProps {
  onAddOrder: (order: Order) => void;
  editingOrder: Order | null;
  onUpdateOrder: (order: Order) => void;
  orders: Order[];
  onSearch: (searchResults: Order[]) => void;
}

const OrdersForm: React.FC<OrdersFormProps> = ({
  onAddOrder,
  editingOrder,
  onUpdateOrder,
  orders,
  onSearch
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [repairType, setRepairType] = useState('');
  const [cost, setCost] = useState<number | ''>(''); 
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [status, setStatus] = useState<OrderStatus>('En proceso');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (editingOrder) {
      setBrand(editingOrder.brand);
      setModel(editingOrder.model);
      setRepairType(editingOrder.repairType);
      setCost(editingOrder.cost);
      setCustomerName(editingOrder.customerName);
      setCustomerPhone(editingOrder.customerPhone);
      setCustomerAddress(editingOrder.customerAddress);
      setStatus(editingOrder.status);
    }
  }, [editingOrder]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    const filteredOrders = orders.filter(order => {
      const searchValue = value.toLowerCase();
      return (
        order.customerName.toLowerCase().includes(searchValue) ||
        order.brand.toLowerCase().includes(searchValue) ||
        order.model.toLowerCase().includes(searchValue)
      );
    });
    
    onSearch(filteredOrders);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setCustomerPhone(value);
    }
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCost(value === '' ? '' : Number(value));
  };

  const resetForm = () => {
    setBrand('');
    setModel('');
    setRepairType('');
    setCost('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setStatus('En proceso');
    setError('');
  };

  // Manejo de la lógica para agregar o actualizar ordenes
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const orderData: Order = {
      brand,
      model,
      repairType,
      cost: typeof cost === 'number' ? cost : 0,
      customerName,
      customerPhone,
      customerAddress,
      status,
      orderNumber: editingOrder ? editingOrder.orderNumber : Math.random().toString(36).substr(2, 9),
    };

    try {
      if (editingOrder) {
        // Si estamos editando, hacemos un PUT para actualizar
        const updatedOrder = { ...orderData, _id: editingOrder._id };
        const response = await axios.put(`https://app-ordenes-backend.onrender.com/api/orders/${editingOrder._id}`, updatedOrder);
        onUpdateOrder(response.data); // Pasamos el objeto actualizado al componente padre
      } else {
        // Si estamos creando una nueva orden, hacemos un POST
        const response = await axios.post('https://app-ordenes-backend.onrender.com/api/orders', orderData);
        onAddOrder(response.data); // Pasamos la nueva orden al componente padre
      }
      resetForm(); // Limpiamos el formulario después de agregar o actualizar
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar la orden');
    }
  };

  return (
    <div className="orders-form-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por cliente, marca o modelo..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <h2>{editingOrder ? 'Editar Orden' : 'Agregar Nueva Orden'}</h2>
      {error && <p className="error-message">{error}</p>}
      
      {editingOrder && (
        <div className="order-id-container">
          <p className="order-id-text">
            <strong>ID de Orden:</strong> {editingOrder._id}
          </p>
          <p className="order-number-text">
            <strong>Número de Orden:</strong> {editingOrder.orderNumber}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Marca"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Tipo de Reparación"
          value={repairType}
          onChange={(e) => setRepairType(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="number"
          placeholder="Costo"
          value={cost}
          onChange={handleCostChange}
          className="input-field"
          required
        />
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
          onChange={handlePhoneChange}
          className="input-field"
          maxLength={10}
          required
        />
        <input
          type="text"
          placeholder="Dirección del Cliente"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          className="input-field"
          required
        />
        
        <div className="status-container">
          <p>Estado de la reparación:</p>
          <div className="status-options">
            <label>
              <input
                type="radio"
                name="status"
                value="En proceso"
                checked={status === 'En proceso'}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              />
              En proceso
            </label>
            
            <label>
              <input
                type="radio"
                name="status"
                value="Reparado"
                checked={status === 'Reparado'}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              />
              Reparado
            </label>
            
            <label>
              <input
                type="radio"
                name="status"
                value="No reparado"
                checked={status === 'No reparado'}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              />
              No reparado
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingOrder ? 'Actualizar' : 'Agregar'}
        </button>
        {editingOrder && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              resetForm();
              onUpdateOrder(editingOrder);
            }}
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};

export default OrdersForm;
