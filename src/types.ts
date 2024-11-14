// types.ts
export type OrderStatus = 'En proceso' | 'Reparado' | 'No reparado';

export interface Order {
  _id?: string;
  brand: string;
  model: string;
  repairType: string;
  cost: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: OrderStatus;
  orderNumber: string;
}
